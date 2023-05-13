import User from "../models/User.js"
import Role from "../models/Role.js"
import jwt from "jsonwebtoken";

export const createUser = async (req, res) => {
  try {
    const { email, first_name, last_name, password, organization, country, roles} = req.body
    // can pass an array with those roles (user and admin)
    const rolesFound = await Role.find({ name: { $in: roles } })
    // creating a new User
    const user = new User({
      email,
      first_name,
      last_name,
      password,
      organization,
      country,
      roles: rolesFound.map(role => role._id),
      active: true
    })

    // encrypting password
    user.password = await User.encryptPassword(user.password)
    // saving the new user
    const savedUser = await user.save()

    return res.status(200).json({
      _id: savedUser._id,
      email: savedUser.email,
      first_name: savedUser.first_name,
      last_name: savedUser.last_name,
      organization: savedUser.organization,
      country: savedUser.country,
      roles: savedUser.roles,
      active: savedUser.active
    })
  } catch (error) {
    console.error(error)
  }
}

export const getMyProfile = async (req, res) => {
  const user = await User.findById(req.userId, { password: 0, active: 0, createdAt: 0, updatedAt: 0, roles: 0 })
  if (!user) return res.status(404).json({ message: "No user found" });
  return res.status(200).json(user);
}

export const getUsers = async (req, res) => {
  const users = await User.find()
  return res.status(200).json(users);
}

export const getUserById = async (req, res) => {
  const user = await User.findById(req.params.userId)
  return res.status(200).json(user);
}

export const deleteUserById = async (req, res) => {
  const { userId } = req.params;
  await User.findByIdAndDelete(userId)
  return res.status(202).json({
    message: "User deleted successfully",
    DELETED_USER: userId
  });
}