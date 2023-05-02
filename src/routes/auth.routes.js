import { Router } from "express";
import { signIn, signUp } from "../controllers/auth.controller";
import { checkDuplicatedUsernameOrEmail, checkRolesExisted } from "../middlewares";
const router = Router();

router.post('/signin', signIn)
router.post('/signup', [checkDuplicatedUsernameOrEmail, checkRolesExisted], signUp)


export default router;