import CallTo from "../models/CallTo"
import CallToComments from "../models/CallToComments";
import Users from "../models/User"

export const getAllCallTo = async (req, res) => {

    const allCallTo = await CallTo.find()
        .populate({
            path: 'owner',
            select: ['email', 'organization', 'first_name', 'last_name'],
            populate: {
                path: 'organization',
                select: ['name', 'logoUrl']
            }
        })
        .catch(err => console.log(err))
    return res.status(200).json(allCallTo);
}

export const getCallToById = async (req, res) => {
    const findCallTo = await CallTo.findById(req.params.id)
        .populate({
            path: 'comments',
            populate: [{
                path: 'replies',
                model: 'Reply',
                populate: {
                    path: 'user',
                    model: 'Users',
                    select: '-password',
                    populate: {
                        path: 'organization',
                        select: 'name'
                    }
                }
            }, {
                path: 'user',
                model: 'Users',
                select: '-password',
                populate: {
                    path: 'organization',
                    select: 'name'
                }
            }]
        })
        .populate({
            path: 'owner',
            model: 'Users',
            select: '-password',
            populate: {
                path: 'organization',
                model: 'Organization'
            }
        })
        .catch(err => console.log(err))
    console.log(findCallTo);
    return res.status(200).json(findCallTo);
}

export const createCallTo = async (req, res) => {

    const { owner, enabled, title, tags, types, location, endDate, about, content, country } = req.body;

    const newCallTo = new CallTo({
        owner,
        enabled,
        title,
        tags,
        types,
        location,
        country,
        endDate,  //default en model a 6 meses desde su creacion
        about,
        content
    });

    newCallTo.owner = req.userId;
    newCallTo.enabled = false;

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
        let call = null;
        try {
            call = await CallTo.findById(req.params.id)
        } catch (error) {
            console.log(error)
        }
        if (call === null) return res.status(400).json({ message: "Call to not found" })

        //check admin or owner
        const isAdmin = req.user.roles.some(role => role.name === "admin")
        const isOwner = req.user._id.toString() === call.owner.toString()
        if (req.user) {
            if (!isAdmin && !isOwner) {
                return res.status(403).json({ message: "You are not admin or owner of the content." })
            }
        }

        // update 'enabled' field
        if (req.body.enabled !== undefined) {
            if (!isAdmin) {
                return res.status(403).json({ message: "You need to be admin to enable a call to" })
            }
            try {
                const updatedCallTo = await call.updateOne({ $set: { enabled: !call.enabled } });
                return res.status(200).json({ message: "Call to set to enabled: " + updatedCallTo });
            } catch (error) {
                return res.status(400).json({ message: "Call to field enabled not updated", error })
            }
        }

        // check if the fields are different from falsy
        const fields = Object.keys(req.body.data)
        if (!fields || !fields.length > 0) {
            return res.status(400).json({ message: "You should modify at least one valid field" })
        }

        for (const item in req.body.data) {
            if (!req.body.data[item] && typeof req.body.data[item] !== 'boolean') {
                return res.status(400).json({ message: `Field '${item}' should not be empty` })
            }
        }

        // update every other field
        try {
            await call.updateOne({ $set: { ...req.body.data } })
            return res.status(200).json({ message: "Call to updated" })
        } catch (error) {
            return res.status(400).json({ message: "Could not update call to" })
        }

    } catch (error) {
        return res.status(500).json({ error: "Server error", error })
    }
}