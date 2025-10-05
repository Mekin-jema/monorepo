// packages/db/src/index.ts

// Export a single Prisma client instance if you have one in lib/prisma
import { mongoPrisma} from "./client/postDBClient";    
import { sqlitePrisma } from "./client/sqliteDBClient";
import { postgresPrisma } from "./client/userDBClient";


// Export all generated clients explicitly
export * as PostgresDB from "../generated/postgres";
export * as MongoDB from "../generated/mongo";
export * as SQLiteDB from "../generated/sqlite";

//  Export the clients for easy access


export {mongoPrisma,sqlitePrisma,postgresPrisma }