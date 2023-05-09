import CallTo from "../models/CallTo"
import CallToComments from "../models/CallToComments";

export const getAllCallTo = async (req, res) => {

    const allCallTo = await CallTo.find()
        .catch(err => console.log(err))

    return res.status(200).json(allCallTo);
}

export const getCallToById = async (req, res) => {
    const findCallTo = await CallTo.findById(req.params.id).populate('comments')
        .catch(err => console.log(err))

    return res.status(200).json(findCallTo);
}

export const createCallTo = async (req, res) => {

    const { owner, enabled, title, tags, types, location, endDate, about, content } = req.body;

    const newCallTo = new CallTo({
        owner,
        enabled,
        title,
        tags,
        types,
        location,
        endDate,
        about,
        content
    });

    newCallTo.owner = req.userId;

    const titleExists = await CallTo.findOne({ title: req.body.title })
        .catch(err => console.log(err));

    if (titleExists) {
        return res.status(400).json({ message: "Your call title is already in use" })
    }

    const savedCallTo = await newCallTo.save()
        .catch(err => console.log(err));

    return res.status(200).json(savedCallTo)
}

export const deleteCallToById = async (req, res) => {
    const findCallTo = await CallTo.findByIdAndRemove(req.params.id)
        .catch(err => console.log(err))

    return res.status(202).json(findCallTo);
}

export const updateCallTo = async (req, res) => {
    const updCall = await CallTo.findById(req.params.id).populate('comments')
        .catch(err => console.log(err))
    if (updCall === null) return res.status(400).json({ message: "Call to not found" })

    if (req.body.newComment) {
        const newComment = new CallToComments({
            callToId: req.params.id,
            content: req.body.newComment,
            user: req.userId,
            likes: [],
            replies: []
        })

        updCall.comments.push(newComment._id);
        const savedComment = await newComment.save()
            .catch(err => console.log(err))
        const updatedCallTo = await updCall.save()
            .catch(err => console.log(err))
        return res.status(200).json({ UPDATED_CALL_TO: updatedCallTo, NEW_COMMENT: savedComment })
    }

    return res.status(200).json(updCall);
}