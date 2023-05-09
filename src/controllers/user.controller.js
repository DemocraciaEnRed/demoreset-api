import User from "../models/User.js"
import Role from "../models/Role.js"

export const createUser = async (req, res) => {
  try {
    const { email, first_name, last_name, password, organization, country } = req.body
    const rolesFound = await Role.find({ name: { $in: "user" } })
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

export const getUsers = async (req, res) => {
  const users = await User.find()
  return res.json(users);
}

export const getUserById = async (req, res) => {
  const user = await User.findById(req.params.userId)
  return res.json(user);
}

export const deleteUserById = async (req, res) => {
  const { userId } = req.params;
  await User.findByIdAndDelete(userId)
  return res.status(202).json({
    message: "User deleted successfully",
    DELETED_USER: userId
  });
}

export const createAdmin = async (req, res) => {
  try {
    const { email, first_name, last_name, password, organization, country } = req.body
    const rolesFound = await Role.find({ name: { $in: "admin" } })
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