import { Router } from "express";
import { signIn, signUp } from "../controllers/auth.controller";
import { checkDuplicatedEmail, checkRolesExisted } from "../middlewares";
const router = Router();

router.post('/signin', signIn)
router.post('/signup', [checkDuplicatedEmail, checkRolesExisted], signUp)


export default router;