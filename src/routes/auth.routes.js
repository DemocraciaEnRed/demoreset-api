import { Router } from "express";
import { signIn, signOut, signUp } from "../controllers/auth.controller";
import { checkDuplicatedEmail, checkRolesExisted, checkValidEmail, checkValidPassword, checkAdminRoleIntrusion, accountValidate, recoveryPassword, sendRecoveryPasswordEmail } from "../middlewares/verifySignup";
import { verifyToken } from "../middlewares/authJwt";
const router = Router();

router.get('/validate/:token', accountValidate)
router.post('/forgotpassword', sendRecoveryPasswordEmail)
router.put('/forgotpassword/:token', recoveryPassword)
router.post('/signin', signIn)
router.post('/signup', [checkValidEmail, checkDuplicatedEmail, checkValidPassword, checkRolesExisted, checkAdminRoleIntrusion], signUp)
router.post('/signout', verifyToken, signOut)


export default router;