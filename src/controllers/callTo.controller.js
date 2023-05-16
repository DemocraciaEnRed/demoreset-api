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

    if (!title) { return res.status(400).json({ message: 'Not a valid title' }) }

    const titleExists = await CallTo.findOne({ title: req.body.title })
        .catch(err => console.log(err));

    if (titleExists) {
        return res.status(400).json({ message: "Your call title is already in use" })
    }

    const savedCallTo = await newCallTo.save()
        .catch((err) => {
            console.log(err)
            res.status(400).json({ error: err })
        });

    return res.status(200).json(savedCallTo)
}

export const deleteCallToById = async (req, res) => {
    const findCallTo = await CallTo.findByIdAndDelete(req.params.id)
        .catch(err => console.log(err))
    if (!findCallTo) return res.status(400).json({ message: "Call to not found" })
    return res.status(202).json({ message: "Call to deleted successfully" });
}

export const updateCallTo = async (req, res) => {
    try {
        const { title, content, about, enabled } = req.body
        let updCall = null;
        try {
            updCall = await CallTo.findById(req.params.id).populate('comments')
        } catch (error) {
            console.log(error)
        }

        //check admin or owner
        const admin = req.user.roles.some(role => role.name === "admin")
        console.log(updCall);
        const owner = req.user._id.toString() === updCall.owner.toString()
        if (req.user) {
            if (!admin && !owner) {
                return res.status(403).json({ message: "You are not admin or owner of the content." })
            }
        }

        if (updCall === null) return res.status(400).json({ message: "Call to not found" })
        if (!title && !content && !about && !enabled) { return res.status(400).json({ message: "You should modify at least one valid field" }) }

        // update callto title
        if (req.body.title) {
            updCall.title = req.body.title;
            const updatedCallTo = await updCall.save()
                .catch(err => console.log(err))
            return res.status(200).json({ message: "Call to field title updated: " + updatedCallTo.title });
        }

        // update callto content
        if (req.body.content) {
            updCall.content = req.body.content;
            const updatedCallTo = await updCall.save()
                .catch(err => console.log(err))
            return res.status(200).json({ message: "Call to field content updated: " + updatedCallTo.content });
        }

        // update callto about
        if (req.body.about) {
            updCall.about = req.body.about;
            const updatedCallTo = await updCall.save()
                .catch(err => console.log(err))
            return res.status(200).json({ message: "Call to field about updated: " + updatedCallTo.about });
        }

        // update callto enabled
        if (req.body.enabled !== undefined) {
            if (!admin) {
                return res.status(403).json({ message: "You need to be admin to enable a call to" })
            }
            try {
                updCall.enabled = !updCall.enabled;
                const updatedCallTo = await updCall.save()
                return res.status(200).json({ message: "Call to set to enabled: " + updatedCallTo.enabled });
            } catch (error) {
                return res.status(400).json({ message: "Call to field enabled not updated", error })
            }
        }
    } catch (error) {
        return res.status(500).json({ error: "Server error", error })
    }
}