import { ROLES } from "../models/Role"
import User from "../models/User"

export const checkDuplicatedEmail = async (req, res, next) => {
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

export const checkValidEmail = (req, res, next) =>{
  const regex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  const testRegex = regex.test(req.body.email)
  if(!testRegex) return res.status(400).json({message: "Email is invalid"})
  next ()
}

export const checkValidPassword = (req, res, next) => {
  const regex = /^[^\t\r\n\s.]{6,}$/;
  const testRegex = regex.test(req.body.password)
  if(!testRegex) return res.status(400).json({message: "Password is invalid"})
  next ()
}