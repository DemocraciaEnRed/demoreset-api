import { Router } from "express";
import { signIn, signUp } from "../controllers/auth.controller";
import { checkDuplicatedEmail, checkRolesExisted, checkValidEmail, checkValidPassword } from "../middlewares";
const router = Router();

router.post('/signin', signIn)
router.post('/signup', [checkValidEmail, checkDuplicatedEmail, checkValidPassword, checkRolesExisted], signUp)


export default router;