import type { FastifyReply, FastifyRequest } from "fastify";
import { getUserFromHeaders } from "../getUser";

export async function isAuthenticated(
  request: FastifyRequest,
  reply: FastifyReply
) {
  const user = await getUserFromHeaders(request.headers);
  if (!user) {
    return reply.status(401).send({ message: "Unauthorized" });
  }
  (request as any).userId = user.userId;
  (request as any).role = user.role;
}

export function authorize(...roles: string[]) {
  return async (request: FastifyRequest, reply: FastifyReply) => {
    const role = (request as any).role;
    if (!role || !roles.includes(role)) {
      return reply.status(403).send({ message: "Forbidden" });
    }
  };
}

export const isAdmin = authorize("admin");
