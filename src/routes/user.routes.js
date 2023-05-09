import { Router } from "express";
import { createUser, getUsers, getUserById, deleteUserById, createAdmin } from "../controllers/user.controller";
import { checkRolesExisted, checkDuplicatedEmail, isAdmin, verifyToken } from "../middlewares";
const router = Router();

router.get('/', [verifyToken, isAdmin] ,getUsers)
router.get('/:userId', [verifyToken, isAdmin], getUserById)
router.post('/', [verifyToken, isAdmin, checkRolesExisted, checkDuplicatedEmail], createUser)
router.post('/createAdmin', [verifyToken, isAdmin, checkRolesExisted, checkDuplicatedEmail], createAdmin)
router.delete('/:userId', [verifyToken, isAdmin], deleteUserById)

export default router; 