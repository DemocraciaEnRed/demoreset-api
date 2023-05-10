import mongoose from "mongoose"

const CallToCommentsSchema = new mongoose.Schema({
  callTo:{
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
    type: mongoose.Types.ObjectId,
    ref: "Reply",
    required: true,
    default:[null]
  }]
},
  {
    timestamps: true,
    versionKey: false
  })

export default mongoose.model('CallToComments', CallToCommentsSchema)

/**
 * Example of how replies look in the database without ref
 * 
 * replies: ['lala01', 'lala02']
 * 
 * replies: [
 * {
 * content: 'Comentario vacío',
 * user: 'user01'
 * id: 'lala01',
 * },
 * {
 * content: 'Comentario vacío',
 * user: 'user01'
 * id: 'lala02',
 * },
 * ]
 * 
 */