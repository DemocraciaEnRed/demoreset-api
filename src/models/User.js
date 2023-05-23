import { Schema, model } from 'mongoose';
import bcrypt from 'bcryptjs';

const Users = new Schema({
  email: {
    type: String,
    unique: true,
    required: true
  },
  first_name: {
    type: String,
    required: true
  },
  last_name: {
    type: String,
    required: true
  },
  password: {
    type: String,
    required: true
  },
  organization: {
    type: Schema.Types.ObjectId,
    ref: "Organization"
  },
  country: {
    type: String,
    required: true
  },
  roles: [{
    type: Schema.Types.ObjectId,
    ref: "Role"
  }],
  active: {
    type: Boolean,
  }
},  
{
  timestamps: true,
  versionKey: false
})

Users.statics.encryptPassword = async (password) => {
  const salt = await bcrypt.genSalt(10)
  return await bcrypt.hash(password, salt)
}

Users.statics.comparePassword = async (password, receivedPassword) => {
  return await bcrypt.compare(password, receivedPassword)
}

export default model('Users', Users)