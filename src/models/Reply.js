import mongoose from 'mongoose';

const Reply = new mongoose.Schema({
  content: {
    type: String,
    required: true
  }, 
  user: {
    type: mongoose.Types.ObjectId,
    ref: "Users",
    required: true,
  },
  comment: {
    type: mongoose.Types.ObjectId,
    ref: "CallToComments",
    required: true,
  }
})

export default mongoose.model('Reply', Reply)
