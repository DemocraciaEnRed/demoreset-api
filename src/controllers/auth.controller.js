import Users from "../models/User";
import Role from "../models/Role";
import jwt from "jsonwebtoken";
import User from "../models/User";
import Organization from "../models/Organization";

export const signUp = async (req, res) => {
  let {
    email,
    first_name,
    last_name,
    password,
    organization,
    country,
    roles,
    active,
  } = req.body;

  try {
    let newOrganization = null

    if(organization.directusId) {
      const foundOrganization = await Organization.findOne({directusId: organization.directusId})
      if(foundOrganization) {
        organization = foundOrganization._id
      } else {
        newOrganization = new Organization({
          directusId: organization.directusId,
          name: organization.name,
          country_en: organization.country_en,
          country_es: organization.country_es,
          logoUrl: organization.logoUrl,
        });
        const savedOrganization = await newOrganization.save();
        organization = savedOrganization._id
      }
    }
  
    const newUser = new Users({
      email,
      first_name,
      last_name,
      password: await Users.encryptPassword(password),
      organization,
      country,
      roles,
      active,
    });
  
    if(roles) {
      const foundRoles = await Role.find({name: { $in: roles }})
      newUser.roles = foundRoles.map(r => r._id)
    } else {
      const role = await Role.findOne({name: "user"})
      newUser.roles = [role._id]
    }
  
    const savedUser = await newUser.save();
  
    const token = jwt.sign({id: savedUser._id}, process.env.JWT_SECRET, {
      expiresIn: 60 * 60 * 24 * 30
    })
  
    res.status(200).json({ token })
  } 
  catch (error) {
    console.log(error)
    res.status(500).json({message: "Error al crear el usuario", error})
  }
};

export const signIn = async (req, res) => {
  const findUser = await User.findOne({email: req.body.email}).catch(err => console.log(err))

  if(!findUser) return res.status(401).json({message: "Invalid email or password"})

  const matchPassword = await User.comparePassword(req.body.password, findUser.password)

  if(!matchPassword) return res.status(401).json({token: null, message: "Invalid email or password"})

  const token = jwt.sign({id: findUser._id}, process.env.JWT_SECRET, {
    expiresIn: 60 * 60 * 24 * 30
  })

  res.json({token})
};

export const signOut = async (req, res) => {
  const authHeader = req.headers["x-access-token"]
  console.log(authHeader);
  console.log(req.headers);
  jwt.sign({id: req.userId}, process.env.JWT_SECRET, {expiresIn: 0}, (err, logout) => {
    if (err) return res.status(400).json({message: "Error al cerrar sesión", err})
    if (logout) {
      res.json({message: "Log out"})
    } else {
      res.json({message: "Error al cerrar sesión"})
    }
  })
}

