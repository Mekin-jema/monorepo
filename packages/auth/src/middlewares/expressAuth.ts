import { Request, Response, NextFunction } from "express";
import { getUserFromHeaders } from "../getUser";
import { auth } from "../auth";
import { fromNodeHeaders } from "better-auth/node";

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
  try {
    console.log("Checking authentication...", req.headers);

    const session = await auth.api.getSession({
      headers: fromNodeHeaders(req.headers),
    });

    if (!session) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    // Attach user info to request object
    req.userId = session.user.id;
    req.role = session.user.role ?? undefined;

    // Call next middleware
    next();
  } catch (err) {
    console.error("Authentication check failed:", err);
    return res.status(500).json({ error: "Internal Server Error" });
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

export const isAdmin = authorize("admin");
