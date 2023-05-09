import { Router } from "express";
import { getAllCallTo, getCallToById, createCallTo, deleteCallToById, updateCallTo } from "../controllers/callTo.controller"
import { updateComments } from "../controllers/callToComments.controller";
import { isAdmin, verifyToken } from "../middlewares/authJwt";
import { enablePermission } from "../middlewares/vertifyUpdateContent";

const router = Router();

// call to
router.get('/', getAllCallTo)
router.get('/:id', getCallToById)
router.post('/', verifyToken, createCallTo)
router.put('/:callId/:commentId', verifyToken, updateComments)
router.put('/:id', [verifyToken, enablePermission], updateCallTo)
router.delete('/:id', [verifyToken, isAdmin], deleteCallToById)

// router.post('/:id', verifyToken, newCallToComment)
export default router;