import type { Context, Next } from "hono";
import { auth } from "@repo/auth"; // Your Better Auth instance

/**
 * Middleware to ensure the user is authenticated.
 * It fetches the session from Better Auth using headers.
 */
export async function isAuthenticated(
  c: Context<Record<string, any>>,
  next: Next
): Promise<Response | void> {
  const session = await auth.api.getSession({ headers: c.req.raw.headers });

  if (!session || !session.user) {
    return c.json({ message: "Unauthorized" }, 401);
  }

  // Save user info in Hono context
  c.set("userId", session.user.id);
  // c.set("role", session.user.role);
  c.set("user", session.user);
  c.set("session", session.session);

  await next();
  return;
}

/**
 * Role-based authorization middleware.
 * Usage: `app.use('/admin/*', authorize('admin'))`
 */
export function authorize(...roles: string[]) {
  return async (
    c: Context<Record<string, any>>,
    next: Next
  ): Promise<Response | void> => {
    const role = c.get("role") as string | undefined;
    if (!role || !roles.includes(role)) {
      return c.json({ message: "Forbidden" }, 403);
    }
    await next();
    return;
  };
}

// Example for quick use
export const isAdmin = authorize("admin");
