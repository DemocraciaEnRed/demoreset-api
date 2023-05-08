import CallTo from "../models/CallTo"
import CallToComments from "../models/CallToComments";

export const getAllCallTo = async (req, res) => {

    const allCallTo = await CallTo.find()
        .catch(err => console.log(err))

    return res.status(200).json(allCallTo);
}

export const getCallToById = async (req, res) => {
    const findCallTo = await CallTo.findById(req.params.id)
        .catch(err => console.log(err))

    return res.status(200).json(findCallTo);
}

export const createCallTo = async (req, res) => {

    const titleExists = await CallTo.findOne({ title: req.body.title })
        .catch(err => console.log(err));

    if (titleExists) {
        return res.status(400).json({ message: "Your call title is already in use" })
    }

    const callTo = new CallTo(req.body);

    const savedCallTo = await callTo.save()
        .catch(err => console.log(err));

    return res.status(200).json(savedCallTo)
}

export const deleteCallToById = async (req, res) => {
    const findCallTo = await CallTo.findByIdAndRemove(req.params.id)
        .catch(err => console.log(err))

    return res.status(202).json(findCallTo);
}

export const updateCallTo = async (req, res) => {
    if (req.body.comments) {
        console.log(req.body.comments)
        const { content, user, likes, replies } = req.body.comments
        CallToComments.findOneAndUpdate(
            { callToId: req.params.id },
            {
                callToId: req.params.id,
                content,
                user,
                likes,
                replies
            },
            { upsert: true }
        )
        delete req.body.comments
    }
    console.log(req.body);
    const updateCallTo = await CallTo.findByIdAndUpdate(req.params.id, { ...req.body }, { new: true })
        .catch(err => console.log(err))

    return res.status(200).json(updateCallTo)
}