import CallToComments from "../models/CallToComments"

export const updateComments = async (req, res) => {
    const { commentId } = req.params
    const comment = await CallToComments.findById(commentId)

    if (!comment) { return res.status(400).json({ error: 'Comment not found' }) }

    if (req.body.newLike) {
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

    // update content
    if (req.body.newMsgContent) {
        comment.content = req.body.newMsgContent
        const savedComment = await comment.save().catch(console.log('error'))
        return res.status(200).json({ message: "comment updated:  " + savedComment.content })
    }

    return res.status(400).json({ message: "nope" })
}
