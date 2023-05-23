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
        type: String,
        required: true,
    },
    endDate: {
        type: Date,
        required: true,
        default: createDefaultDate()
    },
    country: {
        type: String,
        required: true,
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
    }]
},
    {
        timestamps: true,
        versionKey: false
    })

export default mongoose.model('CallTo', CallToSchema)