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
        endDate,  //default en model a 6 meses desde su creacion
        about,
        content
    });

    newCallTo.owner = req.userId;
    newCallTo.enabled = true;

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
    console.log(req.userId);
    const findCallTo = await CallTo.findByIdAndDelete(req.params.id)
        .catch(err => console.log(err))
    if (!findCallTo) return res.status(400).json({ message: "Call to not found" })
    return res.status(202).json({ message: "Call to deleted successfully" });
}

export const updateCallTo = async (req, res) => {
    const updCall = await CallTo.findById(req.params.id).populate('comments')
        .catch(err => console.log(err))
    if (updCall === null) return res.status(400).json({ message: "Call to not found" })

    // update callto title
    if (req.body.newTitle) {
        updCall.title = req.body.newTitle;
        const updatedCallTo = await updCall.save()
            .catch(err => console.log(err))
        return res.status(200).json({ message: "Call to field title updated: " + updatedCallTo.title });
    }

    // update callto content
    if (req.body.newContent) {
        updCall.content = req.body.newContent;
        const updatedCallTo = await updCall.save()
            .catch(err => console.log(err))
        return res.status(200).json({ message: "Call to field content updated: " + updatedCallTo.content });
    }

    // update callto about
    if (req.body.newAbout) {
        updCall.about = req.body.newAbout;
        const updatedCallTo = await updCall.save()
            .catch(err => console.log(err))
        return res.status(200).json({ message: "Call to field about updated: " + updatedCallTo.about });
    }

    // update callto comments
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

    // update callto enabled
    if (req.body.enabled !== undefined) {
        try {
            updCall.enabled = !updCall.enabled;
            const updatedCallTo = await updCall.save()
            return res.status(200).json({ message: "Call to set to enabled: " + updatedCallTo.enabled });
        } catch (error) {
            return res.status(400).json({ message: "Call to field enabled not updated", error })
        }
    }
}