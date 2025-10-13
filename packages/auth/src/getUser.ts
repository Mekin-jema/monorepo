import { auth } from "@repo/auth";
import { fromNodeHeaders } from "better-auth/node";



// Small helper to extract user session
export async function getUserFromHeaders(headers:any) {
  console.log("headers", headers);
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
