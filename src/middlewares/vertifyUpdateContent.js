import { isAdmin } from "./authJwt";


export const enablePermission = async (req, res, next) => {
    if (req.body.enable != undefined) {
        req.headers.set('replies', true);
        isAdmin(req, res, next)
    }
    next();
}