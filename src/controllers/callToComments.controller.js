import CallTo from "../models/CallTo"
import CallToComments from "../models/CallToComments"

export const updateComments = async (req, res) => {
    const { commentId } = req.params
    const comment = await CallToComments.findById(commentId)

    if (!comment) { return res.status(400).json({ error: 'Comment not found' }) }

    // add reply to the comment
    if (req.body.newReply) {
        const newReply = {
            content: req.body.newReply,
            user: req.userId,
        }

        try {
            comment.replies.push(newReply)
            const savedReply = await comment.save()
            return res.status(200).json({ message: "reply added", UPDATED_CALLTO_COMMENTS_REPLY: savedReply.replies })
        }
        catch {
            return res.status(400).json({ error: 'error' })
        }
    }

    // add like to the comment
    if (req.body.newLike !== undefined) { //req takes "" as value
        if (comment.$isEmpty('likes')) { //mongoose fn
            comment.likes.push(req.userId)
            const savedLike = await comment.save().catch(console.log('error'))
            return res.status(200).json({ message: "first like added:  " + savedLike.likes })
        }

        if (comment.likes.includes(req.userId)) {

            const index = comment.likes.indexOf(req.userId)
            if (index > -1) { comment.likes.splice(index, 1) }

            const savedLike = await comment.save()
            return res.status(200).json({ like_removed: req.userId, newArray: savedLike.likes })
        }

        comment.likes.push(req.userId)
        const savedLike = await comment.save().catch(console.log('error'))
        return res.status(200).json({ message: "like added:  " + savedLike.likes })
    }

    // update message of a reply in a comment
    if (req.body.updateReplyContent) {
        const reply = comment.replies.id(req.body.replyId)
        reply.content = req.body.updateReplyContent
        const savedReply = await comment.save()
            .catch(err => console.log(err))
        return res.status(200).json({ message: "reply updated", UPDATED_CALLTO_COMMENT_REPLY: savedReply.replies })
    }

    // delete a reply in a comment
    if (req.body.deleteReply) {
        const reply = comment.replies.id(req.body.deleteReply)
        // console.log(reply);
        const index = comment.replies.indexOf(reply)
        if (index > -1) { comment.replies.splice(index, 1) }
        const savedReply = await comment.save()
            .catch(err => console.log(err))
        return res.status(200).json({ message: "reply deleted", UPDATED_CALLTO_COMMENT_REPLIES: savedReply.replies })
    }

    // update message of the comment
    if (req.body.updateCommentContent) {
        comment.content = req.body.updateCommentContent
        const savedComment = await comment.save().catch(console.log('error'))
        return res.status(200).json({ message: "comment updated:  " + savedComment.content })
    }

    return res.status(400).json({ message: "Request body has invalid values", body: req.body })
}

export const deleteCommentById = async (req, res) => {
    const deleteComment = await CallToComments.findByIdAndRemove(req.params.commentId)
    if (!deleteComment) return res.status(400).json({ message: "Comment not found" })
        .catch(err => console.log(err))
    // delete comment from callto too
    const callTo = await CallTo.findById(req.params.callId)
    callTo.comments.pull(deleteComment)
    const deletedAndUpdatedComment = await callTo.save()
        .catch(err => console.log(err))
    return res.status(202).json({ UPDATED_CALL_TO_MESSAGES: deletedAndUpdatedComment, message: "Comment deleted successfully" });
}