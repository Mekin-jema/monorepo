import { PrismaClient } from "../../generated/sqlite";

const globalForSqlite = global as unknown as { sqlitePrisma: PrismaClient };

export const sqlitePrisma =
  globalForSqlite.sqlitePrisma || new PrismaClient();

if (process.env.NODE_ENV !== "production") globalForSqlite.sqlitePrisma = sqlitePrisma;
