import CallTo from "../models/CallTo"
import CallToComments from "../models/CallToComments"
import Reply from "../models/Reply"

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
    if(req.user){
        const admin = req.user.roles.some(role => role.name === "admin")
        const owner = req.user._id.toString() === commentCallTo.user.toString()
        if (!admin && !owner) {
            return res.status(403).json({ message: "You are not admin or owner of the content." })
        }
    }
    
    // check if the content is empty
    if(req.body.content === "") { return res.status(400).json({ error: 'Empty content' }) }

    // update the content
    try {
        commentCallTo.content = req.body.content
        const savedComment = await commentCallTo.save()
        return res.status(200).json({ message: "comment updated", UPDATED_CALLTO_COMMENTS: savedComment })
    } catch {
        return res.status(400).json({ error: 'error while updating the content' })
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
    if(req.user){
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

export const newReply = async (req, res) => {
    const { callId, commentId } = req.params
    const { content } = req.body
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
        .catch(err => console.log(err))

    // add the reply to the comment
    commentCallTo.replies.push(savedReply._id)
    const updatedComment = await commentCallTo.save()
        .catch(err => console.log(err))

    return res.status(200).json({ UPDATED_CALLTO_COMMENTS_REPLY: updatedComment.replies, NEW_REPLY: savedReply })
}

// export const updateComment = async (req, res) => {
//     const { commentId } = req.params
//     const comment = await CallToComments.findById(commentId)

//     if (!comment) { return res.status(400).json({ error: 'Comment not found' }) }

//     // add reply to the comment
//     if (req.body.newReply) {
//         const newReply = {
//             content: req.body.newReply,
//             user: req.userId,
//         }

//         try {
//             comment.replies.push(newReply)
//             const savedReply = await comment.save()
//             return res.status(200).json({ message: "reply added", UPDATED_CALLTO_COMMENTS_REPLY: savedReply.replies })
//         }
//         catch {
//             return res.status(400).json({ error: 'error' })
//         }
//     }

//     // add like to the comment
//     if (req.body.newLike !== undefined) { //req takes "" as value
//         if (comment.$isEmpty('likes')) { //mongoose fn
//             comment.likes.push(req.userId)
//             const savedLike = await comment.save().catch(console.log('error'))
//             return res.status(200).json({ message: "first like added:  " + savedLike.likes })
//         }

//         if (comment.likes.includes(req.userId)) {

//             const index = comment.likes.indexOf(req.userId)
//             if (index > -1) { comment.likes.splice(index, 1) }

//             const savedLike = await comment.save()
//             return res.status(200).json({ like_removed: req.userId, newArray: savedLike.likes })
//         }

//         comment.likes.push(req.userId)
//         const savedLike = await comment.save().catch(console.log('error'))
//         return res.status(200).json({ message: "like added:  " + savedLike.likes })
//     }

//     // update message of a reply in a comment
//     if (req.body.updateReplyContent) {
//         const reply = comment.replies.id(req.body.replyId)
//         reply.content = req.body.updateReplyContent
//         const savedReply = await comment.save()
//             .catch(err => console.log(err))
//         return res.status(200).json({ message: "reply updated", UPDATED_CALLTO_COMMENT_REPLY: savedReply.replies })
//     }

//     // delete a reply in a comment
//     if (req.body.deleteReply) {
//         const reply = comment.replies.id(req.body.deleteReply)
//         // console.log(reply);
//         const index = comment.replies.indexOf(reply)
//         if (index > -1) { comment.replies.splice(index, 1) }
//         const savedReply = await comment.save()
//             .catch(err => console.log(err))
//         return res.status(200).json({ message: "reply deleted", UPDATED_CALLTO_COMMENT_REPLIES: savedReply.replies })
//     }

//     // update message of the comment
//     if (req.body.updateCommentContent) {
//         comment.content = req.body.updateCommentContent
//         const savedComment = await comment.save().catch(console.log('error'))
//         return res.status(200).json({ message: "comment updated:  " + savedComment.content })
//     }

//     return res.status(400).json({ message: "Request body has invalid values", body: req.body })
// }

// export const deleteCommentById = async (req, res) => {
//     const deleteComment = await CallToComments.findByIdAndRemove(req.params.commentId)
//     if (!deleteComment) return res.status(400).json({ message: "Comment not found" })
//         .catch(err => console.log(err))
//     // delete comment from callto too
//     const callTo = await CallTo.findById(req.params.callId)
//     callTo.comments.pull(deleteComment)
//     const deletedAndUpdatedComment = await callTo.save()
//         .catch(err => console.log(err))
//     return res.status(202).json({ UPDATED_CALL_TO_MESSAGES: deletedAndUpdatedComment, message: "Comment deleted successfully" });
// }