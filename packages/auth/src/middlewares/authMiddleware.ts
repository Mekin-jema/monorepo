import { Request, Response, NextFunction } from "express";
import { auth } from "@repo/auth"; // your Better Auth setup
import { fromNodeHeaders } from "better-auth/node";

declare global {
  namespace Express {
    interface Request {
      userId?: string;
      role?: string;
    }
  }
}

// Middleware to check if user is authenticated
export const isAuthenticated = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const session = await auth.api.getSession({
      headers: fromNodeHeaders(req.headers),
    });

    if (!session) {
      return res.status(401).json({ message: "You are not logged in!" });
    }

    req.userId = session.user.id;
    req.role = session.user.role ?? undefined; // Ensure you store roles in Better Auth

    next();
  } catch (err) {
    console.error("Authentication error:", err);
    return res.status(401).json({ message: "Invalid session!" });
  }
};

// Middleware to authorize based on roles
export const authorize =
  (...roles: string[]) =>
  (req: Request, res: Response, next: NextFunction) => {
    if (!req.role) {
      return res.status(403).json({ message: "Role not found, access denied" });
    }

    if (!roles.includes(req.role)) {
      return res.status(403).json({ message: "Forbidden: insufficient permissions" });
    }

    next();
  };

// Shortcut middleware for admin-only routes
export const isAdmin = authorize("admin");
 