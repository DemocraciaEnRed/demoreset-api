import { Router } from "express";
import { signIn, signOut, signUp } from "../controllers/auth.controller";
import { checkDuplicatedEmail, checkRolesExisted, checkValidEmail, checkValidPassword, checkAdminRoleIntrusion, verifyToken } from "../middlewares";
const router = Router();

router.post('/signin', signIn)
router.post('/signup', [checkValidEmail, checkDuplicatedEmail, checkValidPassword, checkRolesExisted, checkAdminRoleIntrusion], signUp)
router.post('/signout', verifyToken, signOut)


export default router;