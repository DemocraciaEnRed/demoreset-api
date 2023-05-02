import { Router } from "express";
import { createUser } from "../controllers/user.controller";
import { checkRolesExisted, checkDuplicatedUsernameOrEmail } from "../middlewares";
const router = Router();

router.post('/', [checkRolesExisted, checkDuplicatedUsernameOrEmail], createUser)

export default router;