import { Router } from "express";
import { getAllCallTo, getCallToById, createCallTo, deleteCallToById, updateCallTo, updateCallTo2 } from "../controllers/callTo.controller"
import { updateComment, deleteComment, newCallToComment, newLike, getLikesFromComment, getCommentById } from "../controllers/callToComments.controller";
import { isAdmin, verifyToken } from "../middlewares/authJwt";
import { deleteReply, newReply, updateReply } from "../controllers/replies.controller";
const router = Router();

// change isAdmin to checkUpdateContent to allow user to delete/modify their own call to

router.get('/', getAllCallTo)
router.post('/', verifyToken, createCallTo)
router.get('/:id', getCallToById)
router.put('/:id', verifyToken, updateCallTo)
router.patch('/:id', verifyToken, updateCallTo2)
router.delete('/:id', [verifyToken, isAdmin], deleteCallToById)

router.post('/:callId/comment', verifyToken, newCallToComment)
router.get('/:callId/comment/:commentId', getCommentById)
router.put('/:callId/comment/:commentId', verifyToken, updateComment)
router.get('/:callId/comment/:commentId/like', getLikesFromComment)
router.post('/:callId/comment/:commentId/like', verifyToken, newLike)
router.delete('/:callId/comment/:commentId', verifyToken, deleteComment)

router.post('/:callId/comment/:commentId/reply', verifyToken, newReply)
router.put('/:callId/comment/:commentId/reply/:replyId', verifyToken, updateReply)
router.delete('/:callId/comment/:commentId/reply/:replyId', verifyToken, deleteReply)

export default router;