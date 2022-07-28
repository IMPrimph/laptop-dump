import { Request, Response, NextFunction } from "express";
import { veriftJwt } from "../modules/auth/auth.utils";

function deserializeUser(req: Request, res: Response, next: NextFunction) {
  const accessToken = (
    req.headers.authorization ||
    req.cookies.accessToken ||
    ""
  ).replace(/^Bearer\s/, "");

  if (!accessToken) {
    return next();
  }

  const decoded = veriftJwt(accessToken);

  if (decoded) {
    res.locals.user = decoded;
  }

  return next();
}

export default deserializeUser;
