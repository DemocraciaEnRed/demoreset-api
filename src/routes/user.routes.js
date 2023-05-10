import { Router } from "express";
import { createUser, getUsers, getUserById, deleteUserById, createAdmin } from "../controllers/user.controller";
import { checkRolesExisted, checkDuplicatedEmail } from "../middlewares/verifySignup";
import { verifyToken, isAdmin } from "../middlewares/authJwt";
const router = Router();

router.get('/', [verifyToken, isAdmin] ,getUsers)
router.get('/:userId', [verifyToken, isAdmin], getUserById)
router.post('/', [verifyToken, isAdmin, checkRolesExisted, checkDuplicatedEmail], createUser)
router.post('/createAdmin', [verifyToken, isAdmin, checkRolesExisted, checkDuplicatedEmail], createAdmin)
router.delete('/:userId', [verifyToken, isAdmin], deleteUserById)

// TODO
// Get my profile
// router get('/me', [verifyToken], getMyProfile)


export default router; 