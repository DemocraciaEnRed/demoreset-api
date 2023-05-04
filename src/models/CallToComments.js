import { Schema, model } from 'mongoose';

const CallToCommentsSchema = new Schema({
  content: {
    type: String,
    required: true
  },
  user: {
    type: Schema.Types.ObjectId,
    ref: "Users",
    required: true
  },
  likes: [{
    type: Schema.Types.ObjectId,
    ref: "Users",
    required: true,
    default: []
  }],
  replies: [{
    type: [],
    required: true,
    default: []
  }],
  // sin terminar
},
{
  timestamps: true
})

export default model('CallToComments', CallToCommentsSchema)