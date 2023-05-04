import { Schema, model } from 'mongoose';
import CallToComments from './CallToComments';

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
    },
    types: {
        type: [String],
        required: true,
    },
    location: {
        type: [String],
        required: true,
    },
    endDate: {
        type: Date,
        required: true,
    },
    about: {
        type: String,
        required: true,
    },
    comments:[{
        type: Schema.Types.ObjectId,
        ref: "CallToComments",
    }]
})

export default model('CallTo', CallToSchema)