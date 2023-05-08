import { Schema, model } from 'mongoose';

const CallToCommentsSchema = new Schema({
  callToId:{
    type: Schema.Types.ObjectId,
    ref: "CallTo",
    required: true
  },
  content: {
    type: String,
    required: true,
    default:'asdasd'
  },
  user: {
    type: Schema.Types.ObjectId,
    ref: "Users",
    required: true,
    default: '645883523f6a0acec73fcc78'
  },
  likes: [{
    type: Schema.Types.ObjectId,
    ref: "Users",
    required: true,
    default: new Schema.Types.ObjectId()
  }],
  replies: [{
    content: {
      type: String,
      required: true,
      default: 'Comentario vacío'
    },
    user: {
      type: Schema.Types.ObjectId,
      ref: "Users",
      required: true,
      default: '645883523f6a0acec73fcc78'
    }
  }]
},
  {
    timestamps: true,
    versionKey: false
  })

export default model('CallToComments', CallToCommentsSchema)