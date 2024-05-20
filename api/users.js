// const { Mentor, Buddy } = require("../models/mentors");

// module.exports = async (req, res) => {
//   if (req.method === "GET") {
//     // handle GET request
//     res.status(200).json({ message: "GET request to /api/v1/mentors" });
//   } else if (req.method === "POST") {
//     const {
//       FirstName,
//       LastName,
//       EmailAddress,
//       NonSchoolEmailAddress,
//       Phone,
//       ActivityDays,
//       PrimaryStaffRole,
//       SecondaryStaffRole,
//       Paired,
//     } = req.body;

//     try {
//       // create a new mentor
//       const mentor = await Mentor.create({
//         FirstName,
//         LastName,
//         EmailAddress,
//         NonSchoolEmailAddress,
//         Phone,
//         ActivityDays,
//         PrimaryStaffRole,
//         SecondaryStaffRole,
//         Paired,
//       });

//       // send mentor data as response
//       res.status(201).json(mentor);
//     } catch (error) {
//       console.error(error);
//       res.status(500).json({ error: "Internal Server Error" });
//     }
//   } else if (req.method === "DELETE") {
//     const id = req.body;

//     // TODO: what if it is /api/v1/buddies?

//     try {
//       // find mentor
//       const mentor = await Mentor.findByPk(id); // find by primary key

//       if (mentor) {
//         // delete mentor
//         await mentor.destroy();
//         res.status(200).json({ message: `Mentor with id ${id} deleted.` });
//       } else {
//         res.status(404).json({ error: "Mentor Not Found" });
//       }
//     } catch (error) {
//       console.error(error);
//       res.status(500).json({ error: "Method Not Allowed" });
//     }
//   } else {
//     // handle other HTTP methods not supported
//     res.status(405).json({ error: "Method Not Allowed" });
//   }
// };
