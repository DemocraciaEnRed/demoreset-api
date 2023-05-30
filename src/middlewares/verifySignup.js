import { ROLES } from "../models/Role"
import User from "../models/User"
import jwt from "jsonwebtoken"
import { sendEmailPasswordChanged, sendEmailRecoveryPassword } from "../libs/nodemailer"
import * as dotenv from 'dotenv'
dotenv.config()

export const checkDuplicatedEmail = async (req, res, next) => {
  const email = await User.findOne({email: req.body.email})
  if(email && email.active === true) return res.status(400).json({message: "The email already exists"})
  if(email && email.active === false) {
    email.deleteOne({email: req.body.email})
  }
  next()
}

export const checkRolesExisted = (req, res, next) => {
  if (req.body.roles) {
    for (let i = 0; i < req.body.roles.length; i++) {
      if(!ROLES.includes(req.body.roles[i])) {
        return res.status(400).json({
          message: `Role ${req.body.roles[i]} does not exists`
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

export const checkAdminRoleIntrusion = (req, res, next) => {
  if(req.body.roles && req.body.roles.includes("admin")) return res.status(400).json({message: "You can't add admin role"})
  next()
}

export const accountValidate = (req, res) => {
  const token = req.params.token
  if(!token) return res.status(400).json({message: "Token is required"})
  jwt.verify(token, process.env.JWT_SECRET, async (err, decoded) => {
    if(err) return res.status(498).json({message: "Invalid token"})
    const user = await User.findById(decoded.id, {password: 0})
    if(!user) return res.status(400).json({message: "User not found"})
    if(!user.active) {
      user.active = true
      await user.save()
      return res.status(200).json({message: "Account activated"})
    }
    return res.status(400).json({message: "Account already activated"})
  })
}

export const sendRecoveryPasswordEmail = async (req, res) => {
  const { email } = req.body
  const findUser = await User.findOne({email}).catch(err => console.log(err))
  if(!findUser) return res.status(404).json({message: "Email not found"})
  const token = jwt.sign({id: findUser._id}, process.env.JWT_SECRET, {
    expiresIn: 60 * 30
  })
  sendEmailRecoveryPassword(email, token, findUser.first_name, findUser.last_name)
  res.json({message: "Recovery password email sent"})
}

export const recoveryPassword = async (req, res) => {
  const token = req.params.token
  const password = req.body.password
  if(!token) return res.status(400).json({message: "Token is required"})
  jwt.verify(token, process.env.JWT_SECRET, async (err, decoded) => {
    if(err) return res.status(498).json({message: "Invalid token"})
    const user = await User.findById(decoded.id)
    if(!user) return res.status(400).json({message: "User not found"})
    try {
      user.password = await User.encryptPassword(password)
      await user.save()
      sendEmailPasswordChanged(user.email, user.first_name, user.last_name)
      return res.status(200).json({message: "Password changed"})
    } catch (error) {
      console.log(error)
      return res.status(500).json({message: "Error changing password"})
    }
  })
}