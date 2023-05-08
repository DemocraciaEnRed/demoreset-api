import { Router } from "express";
import { getAllCallTo, getCallToById, createCallTo, deleteCallToById, updateCallTo } from "../controllers/callTo.controller"
import { isAdmin, verifyToken } from "../middlewares/authJwt";
import { enablePermission } from "../middlewares/vertifyUpdateContent";

const router = Router();

router.get('/', getAllCallTo)
router.get('/:id', getCallToById)
router.post('/', verifyToken, createCallTo)
router.put('/:id', [verifyToken, enablePermission], updateCallTo)
router.delete('/:id', [verifyToken, isAdmin], deleteCallToById)

export default router;