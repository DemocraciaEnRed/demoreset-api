import Users from "../models/User";
import Role from "../models/Role";
import jwt from "jsonwebtoken";
import User from "../models/User";

export const signUp = async (req, res) => {
  const {
    username,
    email,
    first_name,
    last_name,
    password,
    img,
    organization,
    country,
    role,
    active,
  } = req.body;

  const newUser = new Users({
    username,
    email,
    first_name,
    last_name,
    password: await Users.encryptPassword(password),
    img,
    organization,
    country,
    role,
    active,
  });

  if(role) {
    const foundRoles = await Role.find({name: { $in: role }})
    newUser.role = foundRoles.map(r => r._id)
  } else {
    const role = await Role.findOne({name: "user"})
    newUser.role = [role._id]
  }

  const savedUser = await newUser.save();
  console.log(savedUser)

  const token = jwt.sign({id: savedUser._id}, 'SUPERSECRETO', {
    expiresIn: 60 * 60 * 24 * 30
  })

  res.status(200).json({ token })
};

export const signIn = async (req, res) => {
  const findUser = await User.findOne({email: req.body.email})

  if(!findUser) return res.status(400).json({message: "User not found"})

  const matchPassword = await User.comparePassword(req.body.password, findUser.password)

  if(!matchPassword) return ress.status(401).json({token: null, message: "Invalid password"})

  const token = jwt.sign({id: findUser._id}, 'SUPERSECRETO', {
    expiresIn: 60 * 60 * 24 * 30
  })

  res.json({token})
};
