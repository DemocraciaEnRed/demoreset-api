import { Schema, model } from 'mongoose';

const Organization = new Schema({
  directusId: {
    type: Number,
    required: true,
  },
  name: {
    type: String,
    required: true,
  },
  country_en: {
    type: String,
    required: true,
  },
  country_es: {
    type: String,
    required: true,
  },
  logoUrl: {
    type: String,
    required: true,
  },
  web: {
    type: String,
    required: true,
  }
},
{
  timestamps: true,
  versionKey: false
})


export default model('Organization', Organization)