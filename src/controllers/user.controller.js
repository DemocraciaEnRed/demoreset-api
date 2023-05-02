import User from "../models/User.js";
import Role from "../models/Role.js";

export const createUser = async (req, res) => {
  try {
    const { username, email, first_name, last_name, password, img, organization, country, role, active } = req.body;

    const rolesFound = await Role.find({ name: { $in: role } });

    // creating a new User
    const user = new User({
      username,
      email,
      first_name,
      last_name,
      password,
      img,
      organization,
      country,
      role: rolesFound.map((role) => role._id),
      active,
    });

    // encrypting password
    user.password = await User.encryptPassword(user.password);

    // saving the new user
    const savedUser = await user.save();

    return res.status(200).json({
      _id: savedUser._id,
      username: savedUser.username,
      email: savedUser.email,
      first_name: savedUser.first_name,
      last_name: savedUser.last_name,
      img: savedUser.img,
      organization: savedUser.organization,
      country: savedUser.country,
      role: savedUser.role,
      active: savedUser.active,
    });
  } catch (error) {
    console.error(error);
  }
};

export const getUsers = async (req, res) => {
  const users = await User.find();
  return res.json(users);
};

export const getUser = async (req, res) => {
  const user = await User.findById(req.params.userId);
  return res.json(user);
};