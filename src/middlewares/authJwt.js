import jwt from "jsonwebtoken";
import User from "../models/User";
import Role from "../models/Role";

export const verifyToken = async (req, res, next) => {
  try {
    const token = req.headers["x-access-token"]

    if (!token) return res.status(403).json({ message: "Unauthorized" })

    const decoded = jwt.verify(token, process.env.JWT_SECRET)

    if(!decoded) return res.status(401).json({ message: "Unauthorized" })
    
    req.userId = decoded.id

    const user = await User.findById(req.userId, { password: 0 }).populate('roles')
    if (!user) return res.status(404).json({ message: "No user found" });
    
    req.user = user
    next()
  }
  catch (error) {
    console.error(error)
    return res.status(500).json({ message: error })
  }
}

export const isAdmin = async (req, res, next) => {
  const user = await User.findById(req.userId)
  const roles = await Role.find({_id: {$in: user.roles}})

  for (let i = 0; i < roles.length; i++) {
    if (roles[i].name === "admin") {
      return next()
    }
  }
  return res.status(403).json({message: "You are not admin"})
}
