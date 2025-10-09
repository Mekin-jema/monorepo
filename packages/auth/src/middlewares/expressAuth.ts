import { Request, Response, NextFunction } from "express";
import { getUserFromHeaders } from "../getUser";

// Extend Express request type safely
declare global {
  namespace Express {
    interface Request {
      userId?: string;
      role?: string;
    }
  }
}

export const isAuthenticated = async (req: Request, res: Response, next: NextFunction) => {
  const user = await getUserFromHeaders(req.headers);
  if (!user) {
    return res.status(401).json({ message: "You are not logged in!" });
  }
  req.userId = user.userId;
  req.role = user.role;
  next();
};

export const authorize =
  (...roles: string[]) =>
  (req: Request, res: Response, next: NextFunction) => {
    if (!req.role || !roles.includes(req.role)) {
      return res.status(403).json({ message: "Forbidden" });
    }
    next();
  };

export const isAdmin = authorize("admin");
