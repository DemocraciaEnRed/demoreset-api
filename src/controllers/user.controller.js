// import User from "../models/User.js";
// import Role from "../models/Role.js";

// export const createUser = async (req, res) => {
//   try {
//     const { email, first_name, last_name, password, organization, country, roles, active } = req.body;

//     // creating a new User
//     const user = new User({
//       email,
//       first_name,
//       last_name,
//       password,
//       organization,
//       country,
//       roles: ["admin"],
//       active: true
//     });

//     // encrypting password
//     user.password = await User.encryptPassword(user.password);

//     // saving the new user
//     const savedUser = await user.save();

//     return res.status(200).json({
//       _id: savedUser._id,
//       username: savedUser.username,
//       email: savedUser.email,
//       first_name: savedUser.first_name,
//       last_name: savedUser.last_name,
//       organization: savedUser.organization,
//       country: savedUser.country,
//       roles: savedUser.roles,
//       active: savedUser.active,
//     });
//   } catch (error) {
//     console.error(error);
//   }
// };

// export const getUsers = async (req, res) => {
//   const users = await User.find();
//   return res.json(users);
// };

// export const getUser = async (req, res) => {
//   const user = await User.findById(req.params.userId);
//   return res.json(user);
// }; 