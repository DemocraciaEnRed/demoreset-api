import { Schema, model } from 'mongoose';

const Organization = new Schema({
  directusId: {
    type: Number,
    required: true,
  },
  name: {
    type: String,
    required: false,
  },
  country_en: {
    type: String,
    required: false,
  },
  country_es: {
    type: String,
    required: false,
  },
  logoUrl: {
    type: String,
    required: false,
  },
  web: {
    type: String,
    required: false,
  }
},
{
  timestamps: true,
  versionKey: false
})


export default model('Organization', Organization)