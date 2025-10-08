import { FastifyReply, FastifyRequest } from "fastify";
import { auth,fromNodeHeaders } from "@repo/auth"; // your Better Auth setup

// Extend FastifyRequest type to include user info
declare module "fastify" {
  interface FastifyRequest {
    userId?: string;
    role?: string;
  }
}

// Middleware to check if user is authenticated
export const isAuthenticated = async (request: FastifyRequest, reply: FastifyReply) => {
  try {
    const session = await auth.api.getSession({
      headers: fromNodeHeaders(request.headers),
    });

    if (!session) {
      return reply.status(401).send({ message: "You are not logged in!" });
    }

    request.userId = session.user.id;
    request.role = session.user.role ?? undefined; // store role if available
  } catch (err) {
    console.error("Authentication error:", err);
    return reply.status(401).send({ message: "Invalid session!" });
  }
};

// Middleware to authorize based on roles
export const authorize = (...roles: string[]) => {
  return async (request: FastifyRequest, reply: FastifyReply) => {
    if (!request.role) {
      return reply.status(403).send({ message: "Role not found, access denied" });
    }

    if (!roles.includes(request.role)) {
      return reply.status(403).send({ message: "Forbidden: insufficient permissions" });
    }
  };
};

// Shortcut middleware for admin-only routes
export const isAdmin = authorize("admin");
