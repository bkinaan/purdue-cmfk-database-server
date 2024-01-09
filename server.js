const express = require("express");
const { sequelize } = require("./db/connection");
const { Mentor, Buddy } = require("./models/models");
const cors = require("cors");
const fs = require("fs");
const csvParser = require("csv-parser");
const multer = require("multer");
const passport = require("passport");
require("./config/passport")(passport); // pass passport as argument to passport config
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
require("dotenv").config();

const app = express();
const PORT = process.env.PORT || 8080;

const version = process.env.VERSION || "v1";
const api = `/api/${version}`;

const secretKey = process.env.SECRET_KEY;

app.use(cors());

// sync the Sequelize models with the database
sequelize
  .sync()
  .then(() => {
    console.log("Database and tables created!");
  })
  .catch((error) => {
    console.error("Error syncing database:", error);
  });

// middleware to parse JSON requests
app.use(express.json());

// initialize paasport
app.use(passport.initialize());

// middleware to upload files
const upload = multer({ dest: "uploads/" }); // files will be saved in 'uploads'

// routes
app.post(`${api}/signup`, async (req, res) => {
  const { username, password, EmailAddress } = req.body;

  let mentor = await Mentor.findOne({ where: { EmailAddress } });

  if (!mentor) {
    return res.status(404).send("Mentor not found");
  }

  // hash the password
  // automatically generates a salt and stores it in the hash
  const hashedPassword = await bcrypt.hash(
    password,
    parseInt(process.env.SALT_ROUNDS)
  );

  mentor.username = username;
  mentor.password = hashedPassword;

  // update mentor model
  await mentor.save();

  // mentor = await mentor.update(
  //   { username, password },
  //   { where: { EmailAddress } }
  // );

  // if (!mentor) {
  //   return res.status(404).send("Mentor not updated");
  // }

  const payload = {
    id: mentor.EmailAddress,
    username: mentor.username,
  };

  // sign token that expires in 1 hour
  const token = jwt.sign(payload, secretKey, { expiresIn: "24h" });

  res.send(token);
});

app.post(`${api}/signin`, async (req, res) => {
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

  const token = jwt.sign(payload, secretKey, { expiresIn: "24h" });

  res.send(token);
});

app.get(
  `${api}/home`,
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    res.send(req.mentor);
  }
);

app.post(
  `${api}/mentors/upload`,
  passport.authenticate("jwt", { session: false }),
  upload.single("file"),
  async (req, res) => {
    try {
      const results = [];
      fs.createReadStream(req.file.path)
        .pipe(csvParser())
        .on("data", (data) => results.push(data))
        .on("end", async () => {
          for (let row of results) {
            await Mentor.create({
              FirstName: row.FirstName,
              LastName: row.LastName,
              EmailAddress: row.EmailAddress,
              NonSchoolEmailAddress: row.NonSchoolEmailAddress,
              Phone: row.Phone,
              ActivityDays: row.ActivityDays,
              PrimaryStaffRole: row.PrimaryStaffRole,
              SecondaryStaffRole: row.SecondaryStaffRole,
            });
          }
          res.status(201).json({ message: "Mentors created successfully" });
        });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Internal Server Error" });
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
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Internal Server Error" });
    }
  }
);

app.get(`${api}/buddies`, async (req, res) => {
  try {
    const buddies = await Buddy.findAll();
    res.json(buddies);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

app.post(`${api}/mentors`, async (req, res) => {
  try {
    const {
      FirstName,
      LastName,
      EmailAddress,
      NonSchoolEmailAddress,
      Phone,
      ActivityDays,
      PrimaryStaffRole,
      SecondaryStaffRole,
      Paired,
    } = req.body;
    const newMentor = await Mentor.create({
      FirstName,
      LastName,
      EmailAddress,
      NonSchoolEmailAddress,
      Phone,
      ActivityDays,
      PrimaryStaffRole,
      SecondaryStaffRole,
      Paired,
    });
    res.status(201).json(newMentor);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

app.post(`${api}/buddies`, async (req, res) => {
  try {
    const {
      id,
      FirstName,
      LastName,
      School,
      GradeLevel,
      Allergies,
      MedicalConditions,
      DietaryRestrictions,
      CarriesInhaler,
      CarriesEpiPen,
      HasLearningSocialDevelopmentalEmotionalIssues,
      IssueDetails,
      Medications,
      Other,
      GuardianFirstName,
      GuardianLastName,
      GuardianRelationship,
      GuardianPrimaryPhone,
      GuardianAltPhone,
      GuardianEmailAddress,
      EmergencyContactFirstName,
      EmergencyContactLastName,
      EmergencyContactRelationship,
      EmergencyContactPhone1,
      SafetyNotes,
      ApprovedForPickupFirstName,
      ApprovedForPickupLastName,
      ApprovedForPickupRelationship,
      ApprovedForPickupPrimaryPhone,
      PairedWith,
      FavoriteSubject,
      HobbiesAndInterests,
    } = req.body;
    const newBuddy = await Buddy.create({
      id,
      FirstName,
      LastName,
      School,
      GradeLevel,
      Allergies,
      MedicalConditions,
      DietaryRestrictions,
      CarriesInhaler,
      CarriesEpiPen,
      HasLearningSocialDevelopmentalEmotionalIssues,
      IssueDetails,
      Medications,
      Other,
      GuardianFirstName,
      GuardianLastName,
      GuardianRelationship,
      GuardianPrimaryPhone,
      GuardianAltPhone,
      GuardianEmailAddress,
      EmergencyContactFirstName,
      EmergencyContactLastName,
      EmergencyContactRelationship,
      EmergencyContactPhone1,
      SafetyNotes,
      ApprovedForPickupFirstName,
      ApprovedForPickupLastName,
      ApprovedForPickupRelationship,
      ApprovedForPickupPrimaryPhone,
      PairedWith,
      FavoriteSubject,
      HobbiesAndInterests,
    });
    res.status(201).json(newBuddy);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

app.delete(`${api}/mentors/:id`, async (req, res) => {
  try {
    const { id } = req.params; // extracting id from the URL parameters
    const mentor = await Mentor.findByPk(id); // finding the mentor by primary key

    if (mentor) {
      await mentor.destroy(); // deleting the mentor if found
      res.status(200).json({ message: `Mentor with id ${id} deleted.` });
    } else {
      res.status(404).json({ error: "Mentor Not Found" });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// not needed? -- included above
// sequelize.sync();

// start the server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
