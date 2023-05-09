import CallTo from "../models/CallTo";
import CallToComments from "../models/CallToComments";
import User from "../models/User";

// check if the user is admin or owner of the call to to update the content
export const checkUpdateContent = async (req, res, next) => {
    try {
        const user = await User.findById(req.userId)
        const admin = user.roles.some(role => role.name === "admin")
        const callTo = await CallTo.findById(req.params.id)
        const owner = user._id.toString() === callTo.owner.toString()
        if (req.body.newComment !== undefined) {
            return next()
        }
        if (req.body.newReply !== undefined) {
            return next()
        }
        if (!admin && !owner) {
            return res.status(403).json({ message: "You are not admin or owner of the content." })
        }
        //pasan owner y admin
        if(req.body.enabled !== undefined && !admin){
            return res.status(403).json({ message: "You are not admin." })
        }
        //pasan admin y owner cuando no modifica enabled
        next()
    } catch (error) {
        console.log(error);
    }
}

export const checkUpdateCommentContent = async (req, res, next) => {
    try {
        const user = await User.findById(req.userId)
        const admin = user.roles.some(role => role.name === "admin")
        const comment = await CallToComments.findById(req.params.commentId)
        console.log(user._id.toString());
        console.log("------");
        console.log(comment.user.toString());
        const owner = user._id.toString() === comment.user.toString()
        console.log(owner);

        if (req.body.newReply !== undefined || req.body.newLike !== undefined ) {
            return next()
        }
        if (!admin && !owner) {
            return res.status(403).json({ message: "You are not admin or owner of the content." })
        }
        //pasan owner y admin
        if(req.body.enabled !== undefined && !admin){
            return res.status(403).json({ message: "You are not admin." })
        }
        //pasan admin y owner cuando no modifica enabled
        next()
    } catch (error) {
        console.log(error);
    }
}