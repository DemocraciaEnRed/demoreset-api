import { isAdmin } from "./authJwt";


export const enablePermission = async (req, res, next) => {
    if (req.body.enable !== undefined) {
        isAdmin(req, res, next)
    }
    next();
}