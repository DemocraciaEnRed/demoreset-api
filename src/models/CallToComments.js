import mongoose from "mongoose"

const CallToCommentsSchema = new mongoose.Schema({
  callToId:{
    type: mongoose.Schema.Types.ObjectId,
    ref: "CallTo",
    required: true
  },
  content: {
    type: String,
    required: true,
  },
  user: {
    type: mongoose.Types.ObjectId,
    ref: "Users",
    required: true,
  },
  likes: [{
    type: mongoose.Types.ObjectId,
    ref: "Users",
    required: true,
    default:[null]
  }],
  replies: [{
    content: {
      type: String,
      required: true,
      default: 'Comentario vacío'
    }, 
    user: {
      type: mongoose.Types.ObjectId,
      ref: "Users",
      required: true,
      default: null
    }
  }]
},
  {
    timestamps: true,
    versionKey: false
  })

export default mongoose.model('CallToComments', CallToCommentsSchema)