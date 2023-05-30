import User from "../models/User.js"
import Role from "../models/Role.js"

export const createUser = async (req, res) => {
  try {
    const { email, first_name, last_name, password, organization, country, roles } = req.body
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
  const user = await User.findById(req.userId, { password: 0, active: 0, createdAt: 0, updatedAt: 0 }).populate("roles")
  console.log(user.roles[0].name);
  if (!user) return res.status(404).json({ message: "No user found" });
  return res.status(200).json(user);
}

export const getUsers = async (req, res) => {
  const users = await User.find({}, { password: 0 }).populate("roles").populate("organization")
  return res.status(200).json(users);
}

export const getUserById = async (req, res) => {
  const user = await User.findById(req.params.userId, { password: 0 })
  return res.status(200).json(user);
}

export const updateUser = async (req, res) => {
  const { userId } = req.params;
  const { email, first_name, last_name, organization, country, roles } = req.body;
  const admin = req.user.roles.some(role => role.name === "admin")
  const user = await User.findById(userId)
  if(!user) return res.status(404).json({ message: "User not found" })
  if(req.user) {
    if(!admin) return res.status(401).json({ message: "Unauthorized" })
  }
  try {
    if(email) user.email = email
    if(first_name) user.first_name = first_name
    if(last_name) user.last_name = last_name
    if(organization) user.organization = organization
    if(country) user.country = country
    if(roles) {
      const rolesFound = await Role.find({ name: { $in: roles } })
      user.roles = rolesFound.map(role => role._id)
      if(!rolesFound) return res.status(404).json({ message: "Roles not found" })
    }
    await user.save()
    return res.status(200).json({ message: "User updated successfully" })
  } catch (error) {
    console.error(error)
  }
}

export const deleteUserById = async (req, res) => {
  const { userId } = req.params;
  await User.findByIdAndDelete(userId)
  return res.status(202).json({
    message: "User deleted successfully",
    DELETED_USER: userId
  });
}
