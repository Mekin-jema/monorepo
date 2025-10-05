import { PrismaClient } from "../../generated/postgres";
const globalForPostgres = global as unknown as { postgresPrisma: PrismaClient };

export const postgresPrisma =
  globalForPostgres.postgresPrisma || new PrismaClient();

if (process.env.NODE_ENV !== "production") globalForPostgres.postgresPrisma = postgresPrisma;
