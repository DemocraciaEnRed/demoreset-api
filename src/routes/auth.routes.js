import { Router } from "express";
import { signIn, signUp } from "../controllers/auth.controller";
import { checkDuplicatedEmail, checkRolesExisted, checkValidEmail, checkValidPassword, checkAdminRoleIntrusion } from "../middlewares";
const router = Router();

router.post('/signin', signIn)
router.post('/signup', [checkValidEmail, checkDuplicatedEmail, checkValidPassword, checkRolesExisted, checkAdminRoleIntrusion], signUp)


export default router;