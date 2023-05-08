import mongoose from 'mongoose';
import { createDefaultDate } from '../libs/defaultCallToDate';

const CallToSchema = new mongoose.Schema({
    owner: {
        type: mongoose.Types.ObjectId,
        ref: "Users",
        required: true,
    },
    enabled: {
        type: Boolean,
        required: true,
        default: false
    },
    title: {
        type: String,
        required: true,
    },
    tags: {
        type: [String],
        required: true,
        default: [],
    },
    types: {
        type: [String],
        required: true,
        default: [],
    },
    location: {
        type: [String],
        required: true,
        default: [],
    },
    endDate: {
        type: Date,
        required: true,
        default: createDefaultDate()
    },
    about: {
        type: String,
        required: true,
    },
    content: {
        type: String,
        required: true,
    },
    comments: [{
        type: mongoose.Types.ObjectId,
        ref: "CallToComments",
        default: new mongoose.Types.ObjectId()
    }]
},
    {
        timestamps: true,
        versionKey: false
    })

export default mongoose.model('CallTo', CallToSchema)