import CallTo from "../models/CallTo"
import CallToComments from "../models/CallToComments"
import Reply from "../models/Reply"
import User from "../models/User"

export const getCommentById = async (req, res) => {
    const comment = await CallToComments.findById(req.params.commentId)
        .populate([{
            path: 'replies',
            model: 'Reply',
            populate: {
                path: 'user',
                select: '-password',
                model: 'Users'
            }
        },
        {
            path: 'user',
            select: '-password',
            model: 'Users'
        }])
        .catch(err => {
            console.log(err)
            return res.status(404).json({ message: 'Comment not found' })
        })

    return res.status(200).json(comment)
}

export const newCallToComment = async (req, res) => {
    try {
        // create a comment in the call to 
        const { callId } = req.params
        const { content } = req.body
        // check that CallTo exists
        const callTo = await CallTo.findById(callId)
        if (!callTo) { return res.status(404).json({ error: 'CallTo not found' }) }

        // create a new comment
        const newComment = new CallToComments({
            callTo: callId,
            content: content,
            user: req.userId,
            likes: [],
            replies: []
        })
        // save the comment
        const savedComment = await newComment.save()
            .catch(err => console.log(err))

        // add the comment to the callTo
        callTo.comments.push(savedComment._id)

        const updatedCallTo = await callTo.save()
            .catch(err => console.log(err))

        return res.status(200).json({ UPDATED_CALL_TO: updatedCallTo, NEW_COMMENT: savedComment })
    }
    catch (error) {
        return res.status(400).json({ message: "Error while creating the comment", error })
    }
}

export const updateComment = async (req, res) => {
    const { callId, commentId } = req.params
    // check that CallTo exists
    const callTo = await CallTo.findById(callId)
    if (!callTo) { return res.status(404).json({ error: 'CallTo not found' }) }

    // check that comment exists
    const commentCallTo = await CallToComments.findById(commentId)
    if (!commentCallTo) { return res.status(404).json({ error: 'Comment not found' }) }

    // check if the user is admin or owner of the commentCallTo to update the content
    if (req.user) {
        const admin = req.user.roles.some(role => role.name === "admin")
        const owner = req.user._id.toString() === commentCallTo.user.toString()
        if (!admin && !owner) {
            return res.status(403).json({ message: "You are not admin or owner of the content." })
        }
    }

    // check if the content is empty
    if (req.body.content === "") { return res.status(400).json({ error: 'Empty content' }) }

    // update the content
    try {
        commentCallTo.content = req.body.content
        const savedComment = await commentCallTo.save()
        return res.status(200).json({ message: "comment updated", UPDATED_CALLTO_COMMENTS: savedComment })
    } catch {
        return res.status(400).json({ error: 'error while updating the content' })
    }
}

export const getLikesFromComment = async (req, res) => {
    const { commentId } = req.params
    const comment = await CallToComments.findById(commentId)
    return res.status(200).json({ likes: comment.likes })
}

export const newLike = async (req, res) => {
    const { callId, commentId } = req.params
    // check that CallTo exists
    const callTo = await CallTo.findById(callId)
    if (!callTo) { return res.status(404).json({ error: 'CallTo not found' }) }

    // check that comment exists
    const commentCallTo = await CallToComments.findById(commentId).populate('replies')
    if (!commentCallTo) { return res.status(404).json({ error: 'Comment not found' }) }

    // add the like to the comment
    try {
        // check if the user already liked the comment
        const user = await User.findById(req.userId)
        if (commentCallTo.likes.includes(user._id)) {
            // remove the like
            const index = commentCallTo.likes.indexOf(user._id)
            if (index > -1) { commentCallTo.likes.splice(index, 1) }
            const savedComment = await commentCallTo.save()
            return res.status(200).json({ message: "like removed", UPDATED_CALLTO_COMMENTS: savedComment })
        }
        commentCallTo.likes.push(user._id)
        const savedComment = await commentCallTo.save()
        return res.status(200).json({ message: "like added", UPDATED_CALLTO_COMMENTS: savedComment })
    }
    catch (error) {
        return res.status(400).json({ message: "Error while liking the comment", error })
    }

}

export const deleteComment = async (req, res) => {
    const { callId, commentId } = req.params
    // check that CallTo exists
    const callTo = await CallTo.findById(callId)
    if (!callTo) { return res.status(404).json({ error: 'CallTo not found' }) }

    // check that comment exists
    const commentCallTo = await CallToComments.findById(commentId).populate('replies')
    if (!commentCallTo) { return res.status(404).json({ error: 'Comment not found' }) }

    // check if the user is admin or owner of the commentCallTo to update the content
    if (req.user) {
        const admin = req.user.roles.some(role => role.name === "admin")
        const owner = req.user._id.toString() === commentCallTo.user.toString()
        if (!admin && !owner) {
            return res.status(403).json({ message: "You are not admin or owner of the content." })
        }
    }

    try {
        // delete the replies of the comment
        if (commentCallTo.replies.length > 0) {
            commentCallTo.replies.forEach(async reply => {
                const deletedReply = await Reply.findByIdAndDelete(reply._id)
                console.log(deletedReply)
            })
        }

        // delete the comment from the callTo
        const index = callTo.comments.indexOf(commentCallTo._id)
        if (index > -1) { callTo.comments.splice(index, 1) }
        await callTo.save()

        // delete the comment
        const deletedComment = await CallToComments.findByIdAndDelete(commentCallTo)
        return res.status(200).json({ message: "comment deleted", DELETED_CALLTO_COMMENTS: deletedComment })
    } catch {
        return res.status(400).json({ error: 'error while deleting the comment' })
    }
}