import { Router } from "express";
import { createUser, getUsers, getUserById, deleteUserById, getMyProfile, updateUser } from "../controllers/user.controller";
import { checkRolesExisted, checkDuplicatedEmail } from "../middlewares/verifySignup";
import { verifyToken, isAdmin } from "../middlewares/authJwt";
const router = Router();

router.get('/me', verifyToken, getMyProfile)
router.get('/', [verifyToken, isAdmin] ,getUsers)
router.post('/', [verifyToken, isAdmin, checkRolesExisted, checkDuplicatedEmail], createUser)
router.get('/:userId', [verifyToken, isAdmin], getUserById)
router.put('/:userId', [verifyToken, isAdmin, checkRolesExisted, checkDuplicatedEmail], updateUser)
router.delete('/:userId', [verifyToken, isAdmin], deleteUserById)

export default router; 