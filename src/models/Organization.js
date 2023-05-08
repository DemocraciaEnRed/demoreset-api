import { Schema, model } from 'mongoose';

const Organization = new Schema({
  directusId: {
    type: String,
    required: true,
  },
  name_es: {
    type: String,
    required: true,
  },
  name_en: {
    type: String,
    required: true,
  },
  hub: {
    type: String,
    required: false,
  },
  logoUrl: {
    type: String,
    required: false,
    default: null,
  }
},
{
  timestamps: true,
  versionKey: false
})


export default model('Organization', Organization)