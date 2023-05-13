import { Router } from "express";
import { getAllCallTo, getCallToById, createCallTo, deleteCallToById, updateCallTo } from "../controllers/callTo.controller"
import { updateComment, deleteComment, newCallToComment, newReply } from "../controllers/callToComments.controller";
import { isAdmin, verifyToken } from "../middlewares/authJwt";
const router = Router();

// change isAdmin to checkUpdateContent to allow user to delete/modify their own call to

router.get('/', getAllCallTo)
router.post('/', verifyToken, createCallTo)
router.get('/:id', getCallToById)
router.put('/:id', [verifyToken], updateCallTo)

router.delete('/:id', [verifyToken, isAdmin], deleteCallToById)
router.post('/:callId/comment', verifyToken, newCallToComment)
router.put('/:callId/comment/:commentId', verifyToken, updateComment)
router.delete('/:callId/comment/:commentId', verifyToken, deleteComment)
router.post('/:callId/comment/:commentId/reply', verifyToken, newReply)
// TODO
// POST edit a reply to a comment
// router.put('/:callId/comment/:commentId/reply/:replyId', verifyToken, updateComments)
// TODO
// POST delete a reply to a comment
// router.delete('/:callId/:commentId/reply/:replyId', verifyToken, deleteCommentById)




// router.post('/:id', verifyToken, newCallToComment)
export default router;