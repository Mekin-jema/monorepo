import { PrismaClient } from "../../generated/mongo";

const globalForMongo = global as unknown as { mongoPrisma: PrismaClient };

export const mongoPrisma =
  globalForMongo.mongoPrisma || new PrismaClient();

if (process.env.NODE_ENV !== "production") globalForMongo.mongoPrisma = mongoPrisma;
