const express = require("express");
const { sequelize, transaction } = require("./db/connection");
const { Mentor, Buddy } = require("./models/models");
const cors = require("cors");
require("dotenv").config();

const passport = require("passport");
require("./config/passport")(passport); // pass passport as argument to passport config
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const app = express();
const PORT = process.env.PORT || 8080;

const version = process.env.VERSION || "v1";
const api = `/api/${version}`;

const secretKey = process.env.SECRET_KEY;

app.use(cors());

sequelize
  .sync()
  .then(() => {
    console.log("Database and tables created!");
  })
  .catch((error) => {
    console.error("Error syncing database:", error);
  });

app.use(express.json());

// initialize passport
app.use(passport.initialize());

app.post(`${api}/signup`, async (req, res) => {
  let { username, password, FirstName, LastName, EmailAddress } = req.body;

  // hash password for security
  const hashedPassword = await bcrypt.hash(
    password,
    parseInt(process.env.SALT_ROUNDS)
  );

  password = hashedPassword;

  // create mentor
  let newMentor;
  await sequelize.transaction(async (t) => {
    newMentor = await Mentor.create(
      {
        username,
        password,
        FirstName,
        LastName,
        EmailAddress,
      },
      { transaction, t }
    );
  });

  const payload = {
    id: newMentor.EmailAddress,
    username: newMentor.username,
  };

  const token = jwt.sign(payload, secretKey, {
    expiresIn: process.env.EXPIRES_IN,
  });
  res.status(201).json(token);
});

app.post(`${api}/login`, async (req, res) => {
  const { username, password } = req.body;

  const mentor = await Mentor.findOne({ where: { username } });

  if (!mentor) {
    return res.status(404).send("Mentor not found");
  }

  const valid = await mentor.validPassword(password);

  if (!valid) {
    return res.status(401).send(`Invalid password: ${mentor.password}`);
  }

  const payload = {
    username: mentor.username,
  };

  const token = jwt.sign(payload, secretKey, {
    expiresIn: process.env.EXPIRES_IN,
  });

  res.send(token);
});

app.post(
  `${api}/pairs`,
  passport.authenticate("jwt", { session: false }),
  async (req, res) => {
    try {
      const { school, grade } = req.body;
      const mentors = await Mentor.findAll();
      // only get buddies that match the request
      let buddies;

      if (!grade && !school) {
        buddies = await Buddy.findAll();
      } else if (!grade) {
        buddies = await Buddy.findAll({
          where: {
            School: school,
          },
        });
      } else if (!school) {
        buddies = await Buddy.findAll({
          where: {
            GradeLevel: grade,
          },
        });
      } else {
        buddies = await Buddy.findAll({
          where: {
            School: school,
            GradeLevel: grade,
          },
        });
      }

      let list = [];

      // pull out mentors that have the buddies found
      for (let mentor of mentors) {
        // only check mentors that are paired
        if (mentor.PairedWith) {
          const [firstName, lastName] = mentor.PairedWith.split(" ");
          const buddy = buddies.find(
            (buddy) =>
              buddy.FirstName === firstName && buddy.LastName == lastName
          );

          if (buddy) {
            list.push(mentor);
          }
        }
      }

      res.json(list);
    } catch (e) {
      console.error(e);
    }
  }
);

app.get(
  `${api}/mentors`,
  passport.authenticate("jwt", { session: false }),
  async (req, res) => {
    try {
      const mentors = await Mentor.findAll();

      res.json(mentors);
    } catch (e) {
      console.error(e);
      res.status(500).json({ error: "Internal Server Error" });
    }
  }
);

app.get(
  `${api}/buddies`,
  passport.authenticate("jwt", { session: false }),
  async (req, res) => {
    try {
      const buddies = await Buddy.findAll();

      res.json(buddies);
    } catch (e) {
      console.error(e);
      res.status(500).json({ error: "Internal Server Error" });
    }
  }
);

app.get(`${api}/notpairedbuddies`, async (req, res) => {
  try {
    const buddies = await Buddy.findAll();
    const mentors = await Mentor.findAll();

    // list of buddies that are paired
    const pairedBuddies = mentors
      .filter((mentor) => mentor.PairedWith !== null)
      .map((mentor) => mentor.PairedWith);

    // split paired buddies' names into first and last
    const pairedBuddiesNames = pairedBuddies.map((buddy) => {
      const [firstName, lastName] = buddy.split(" ");
      return `${firstName} ${lastName}`;
    });

    // create list of buddies that are paired
    const notPairedBuddies = buddies.filter((buddy) => {
      const buddyFullName = `${buddy.FirstName} ${buddy.LastName}`;
      return !pairedBuddiesNames.includes(buddyFullName);
    });

    res.json(notPairedBuddies);
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

app.post(
  `${api}/buddies`,
  passport.authenticate("jwt", { session: false }),
  async (req, res) => {
    try {
      const { FirstName, LastName, School, GradeLevel } = req.body;
      let newBuddy;
      await sequelize.transaction(async (t) => {
        newBuddy = await Buddy.create(
          {
            FirstName,
            LastName,
            School,
            GradeLevel,
          },
          { transaction, t }
        );
      });
      res.status(201).json(newBuddy);
    } catch (e) {
      console.error(e);
      res.status(500).json({ error: "Internal Server Error" });
    }
  }
);

app.put(
  `${api}/mentors/:id`,
  passport.authenticate("jwt", { session: false }),
  async (req, res) => {
    try {
      const id = req.params.id;
      const {
        username,
        FirstName,
        LastName,
        EmailAddress,
        StaffRole,
        PairedWith,
      } = req.body;

      const mentor = await sequelize.query(
        "SELECT * FROM Mentors WHERE id = :id",
        {
          replacements: { id: id },
          type: sequelize.QueryTypes.SELECT,
        }
      );

      if (!mentor.length) {
        return res.status(404).json({ error: "Mentor not found" });
      }

      await sequelize.query(
        "UPDATE Mentors SET username = :username, FirstName = :FirstName, LastName = :LastName, EmailAddress = :EmailAddress, StaffRole = :StaffRole, PairedWith = :PairedWith WHERE id = :id",
        {
          replacements: {
            id: id,
            username: username,
            FirstName: FirstName,
            LastName: LastName,
            EmailAddress: EmailAddress,
            StaffRole: StaffRole,
            PairedWith: PairedWith,
          },
        }
      );

      const updatedMentor = await sequelize.query(
        "SELECT * FROM Mentors WHERE id = :id",
        {
          replacements: { id: id },
          type: sequelize.QueryTypes.SELECT,
        }
      );

      res
        .status(200)
        .json({
          message: "Mentor updated successfully!",
          mentor: updatedMentor,
        });
    } catch (e) {
      console.error(e);
      res.status(500).json({ error: "Internal Server Error" });
    }
  }
);

app.put(
  `${api}/buddies/:id`,
  passport.authenticate("jwt", { session: false }),
  async (req, res) => {
    try {
      const id = req.params.id;
      const { FirstName, LastName, School, GradeLevel } = req.body;

      const buddy = await sequelize.query(
        "SELECT * FROM Buddies WHERE id = :id",
        {
          replacements: { id: id },
          type: sequelize.QueryTypes.SELECT,
        }
      );

      if (!buddy.length) {
        return res.status(404).json({ error: "Buddy not found" });
      }

      await sequelize.query(
        "UPDATE Buddies SET FirstName = :FirstName, LastName = :LastName, School = :School, GradeLevel = :GradeLevel WHERE id = :id",
        {
          replacements: {
            id: id,
            FirstName: FirstName,
            LastName: LastName,
            School: School,
            GradeLevel: GradeLevel,
          },
        }
      );

      const updatedBuddy = await sequelize.query(
        "SELECT * FROM Buddies WHERE id = :id",
        {
          replacements: { id: id },
          type: sequelize.QueryTypes.SELECT,
        }
      );

      res
        .status(200)
        .json({ message: "Buddy updated successfully!", buddy: updatedBuddy });
    } catch (e) {
      console.error(e);
      res.status(500).json({ error: "Internal Server Error" });
    }
  }
);

app.delete(
  `${api}/mentors/:id`,
  passport.authenticate("jwt", { session: false }),
  async (req, res) => {
    try {
      const id = req.params.id;
      const mentor = await sequelize.query(
        "SELECT * FROM Mentors WHERE id = :id",
        {
          replacements: { id: id },
          type: sequelize.QueryTypes.SELECT,
        }
      );

      if (!mentor.length) {
        return res.status(404).json({ error: "Mentor not found" });
      }

      await sequelize.query("DELETE FROM Mentors WHERE id = :id", {
        replacements: { id: id },
      });

      res.status(200).json({ message: "Mentor deleted successfully" });
    } catch (e) {
      console.error(e);
      res.status(500).json({ error: "Internal Server Error" });
    }
  }
);

app.delete(
  `${api}/buddies/:id`,
  passport.authenticate("jwt", { session: false }),
  async (req, res) => {
    try {
      const id = req.params.id;
      const buddy = await sequelize.query(
        "SELECT * FROM Buddies WHERE id = :id",
        {
          replacements: { id: id },
          type: sequelize.QueryTypes.SELECT,
        }
      );

      if (!buddy.length) {
        return res.status(404).json({ error: "Buddy not found" });
      }

      await sequelize.query("DELETE FROM Buddies WHERE id = :id", {
        replacements: { id: id },
      });

      res.status(200).json({ message: "Buddy deleted successfully" });
    } catch (e) {
      console.error(e);
      res.status(500).json({ error: "Internal Server Error" });
    }
  }
);

app.listen(PORT, () => {
  console.log(`Server started on port ${PORT}`);
});
