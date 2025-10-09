import type { IncomingHttpHeaders } from "http";
import { auth } from "@repo/auth";
import { fromNodeHeaders } from "better-auth/node";

// Define a generic interface for user session data
export interface AuthenticatedRequest {
  userId?: string;
  role?: string;
}

// Small helper to extract user session
export async function getUserFromHeaders(headers: IncomingHttpHeaders) {
  try {
    const session = await auth.api.getSession({
      headers: fromNodeHeaders(headers),
    });
    if (!session) return null;

    return {
      userId: session.user.id,
      role: session.user.role ?? undefined,
    };
  } catch {
    return null;
  }
}
