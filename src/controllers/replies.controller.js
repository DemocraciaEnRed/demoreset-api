import CallTo from "../models/CallTo"
import CallToComments from "../models/CallToComments"
import Reply from "../models/Reply"

export const newReply = async (req, res) => {
    const { callId, commentId } = req.params
    const { content } = req.body
    // check if the content is empty
    if (content === "") { return res.status(400).json({ error: 'Empty content' }) }
     
    // check that CallTo exists
    const callTo = await CallTo.findById(callId)
    if (!callTo) { return res.status(404).json({ error: 'CallTo not found' }) }

    // check that comment exists
    const commentCallTo = await CallToComments.findById(commentId)
    if (!commentCallTo) { return res.status(404).json({ error: 'Comment not found' }) }

    // create a new reply
    const newReply = new Reply({
        content: content,
        user: req.userId,
        comment: commentId
    })

    // save the reply
    const savedReply = await newReply.save()
        .catch(err => console.error(err))

    // add the reply to the comment
    commentCallTo.replies.push(savedReply._id)
    const updatedComment = await commentCallTo.save()
        .catch(err => console.error(err))

    return res.status(200).json({ UPDATED_CALLTO_COMMENTS_REPLY: updatedComment.replies, NEW_REPLY: savedReply })
}

export const updateReply = async (req, res) => {
    const { callId, commentId, replyId } = req.params
    const { content } = req.body

    // check if the content is empty
    if (content === "") { return res.status(400).json({ error: 'Empty content' }) }

    // check if reply exists
    const replyCallTo = await Reply.findById(replyId)
        .catch(err => console.error(err))

    if (!replyCallTo) { return res.status(404).json({ error: 'Reply not found' }) }

    // check user permissions
    if (req.user) {
        const admin = req.user.roles.some(role => role.name === "admin")
        const owner = req.user._id.toString() === replyCallTo.user.toString()
        if (!admin && !owner) {
            return res.status(403).json({ message: "You are not admin or owner of the content." })
        }
    }

    // check that CallTo exists
    const callTo = await CallTo.findById(callId)
    if (!callTo) { return res.status(404).json({ error: 'CallTo not found' }) }

    // check that comment exists
    const commentCallTo = await CallToComments.findById(commentId)
    if (!commentCallTo) { return res.status(404).json({ error: 'Comment not found' }) }

    // Reply update
    try {
        replyCallTo.content = content
        const updatedReply = await replyCallTo.save()
        return res.status(200).json({ message: 'reply ', NEW_REPLY: updatedReply })
    } catch (error) {
        err => console.error(err)
        return res.status(500).json({ message: 'Error updating reply' })
    }

}

export const deleteReply = async (req, res) => {
    const { callId, commentId, replyId } = req.params

    // check if reply exists
    const replyCallTo = await Reply.findById(replyId)
        .catch(err => console.error(err))
    if (!replyCallTo) { return res.status(404).json({ error: 'Reply not found' }) }

    //check user permissions
    if (req.user) {
        const admin = req.user.roles.some(role => role.name === "admin")
        const owner = req.user._id.toString() === replyCallTo.user.toString()
        if (!admin && !owner) {
            return res.status(403).json({ message: "You are not admin or owner of the content." })
        }
    }

    // check that comment exists
    const commentCallTo = await CallToComments.findById(commentId)
    if (!commentCallTo) { return res.status(404).json({ error: 'Comment not found' }) }

    // check that CallTo exists
    const callTo = await CallTo.findById(callId)
    if (!callTo) { return res.status(404).json({ error: 'CallTo not found' }) }


    //delete reply from array in comment
    // check that reply exists in comment and save its index
    let replyIdx = undefined
    const commentContainsReply = commentCallTo.replies.some((reply, index) => {
        if (reply.toString() === replyCallTo._id.toString()) {
            replyIdx = index
            return 1
        }
        return 0
    })
    if (!commentContainsReply) { return res.status(404).json({ error: 'Reply doesn\'t belong to the comment' }) }

    //on successfull delete reply from array, delete reply from collection
    try {
        // overwrite replies array in comment
        if (replyIdx > -1) { commentCallTo.replies.splice(replyIdx, 1) }
        await commentCallTo.save()
        try {
            //delete reply itself
            const deletedReply = await Reply.findByIdAndRemove(replyCallTo._id)
            res.status(200).json({ message: 'Reply deleted successfully', DELETED_REPLY: deletedReply })
        } catch (error) {
            console.log(error);
            res.status(500).json({ error, message: 'could not delete reply' })
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ error, message: 'could not delete reply from comments' })
    }

}