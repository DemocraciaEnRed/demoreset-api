import { ROLES } from "../models/Role"
import User from "../models/User"

export const checkDuplicatedUsernameOrEmail = async (req, res, next) => {
  const user = await User.findOne({username: req.body.username})
  if(user) return res.status(400).json({message: "The user already exists"})

  const email = await User.findOne({email: req.body.email})
  if(email) return res.status(400).json({message: "The email already exists"})

  next()
}

export const checkRolesExisted = (req, res, next) => {
  if (req.body.role) {
    for (let i = 0; i < req.body.role.length; i++) {
      if(!ROLES.includes(req.body.role[i])) {
        return res.status(400).json({
          message: `Role ${req.body.role[i]} does not exists`
        })
      }
    }
  }
  next()
}