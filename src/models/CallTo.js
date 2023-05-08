import { Schema, model } from 'mongoose';
import { createDefaultDate } from '../libs/defaultCallToDate';

const CallToSchema = new Schema({
    owner: {
        type: String,
        required: true
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
        type: Schema.Types.ObjectId,
        ref: "CallToComments",
        default: new Schema.Types.ObjectId()
    }]
},
    {
        timestamps: true,
        versionKey: false
    })

export default model('CallTo', CallToSchema)