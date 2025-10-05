// middlewares/auth.ts
import { Request, Response, NextFunction } from "express";
import { auth } from "@repo/auth"; // import from your setup

declare global {
  namespace Express {
    interface Request {
      userId?: string;
      role?: string;
    }
  }
}

export const isAuthenticated = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const session = await auth.api.verifySession({
      headers: req.headers, // pass request headers (Authorization, cookies, etc.)
    });

    if (!session) {
      return res.status(401).json({ message: "You are not logged in!" });
    }

    req.userId = session.user.id;
    req.role = session.user.role; // assuming you set roles in Better Auth

    next();
  } catch (err) {
    return res.status(401).json({ message: "Invalid session!" });
  }
};

export const authorize =
  (...roles: string[]) =>
  (req: Request, res: Response, next: NextFunction) => {
    if (!req.role || !roles.includes(req.role)) {
      return res.status(403).json({ message: "Forbidden" });
    }
    next();
  };
