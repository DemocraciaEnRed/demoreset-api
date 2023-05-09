import { Router } from "express";
import { getAllCallTo, getCallToById, createCallTo, deleteCallToById, updateCallTo } from "../controllers/callTo.controller"
import { updateComments, deleteCommentById } from "../controllers/callToComments.controller";
import { isAdmin, verifyToken } from "../middlewares/authJwt";
import { checkUpdateCommentContent, checkUpdateContent } from "../middlewares/vertifyUpdateContent";
const router = Router();

// change isAdmin to checkUpdateContent to allow user to delete/modify their own call to

router.get('/', getAllCallTo)
router.get('/:id', getCallToById)
router.post('/', verifyToken, createCallTo)
router.put('/:callId/:commentId', [verifyToken, checkUpdateCommentContent], updateComments)
router.put('/:id', [verifyToken, checkUpdateContent], updateCallTo)
router.delete('/:id', [verifyToken, isAdmin], deleteCallToById)
router.delete('/:callId/:commentId', [verifyToken, isAdmin], deleteCommentById)

// router.post('/:id', verifyToken, newCallToComment)
export default router;