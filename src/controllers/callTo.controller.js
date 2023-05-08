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
    // add comment to the call to
    if (req.body.comments) {
        const newComment = new CallToComments({
            callToId: req.params.id,
            content: req.body.comments.content,
            user: req.userId,
            likes: [],
            replies: []
        });

        const savedComment = await newComment.save()
            .catch(err => console.log(err));

        const findCallTo = await CallTo.findById(req.params.id)
            .catch(err => console.log(err))

        findCallTo.comments.push(savedComment._id);

        const updatedCallTo = await findCallTo.save()
            .catch(err => console.log(err));
        
        return res.status(200).json(updatedCallTo);
    }

    
}