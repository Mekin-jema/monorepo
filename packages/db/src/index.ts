// packages/db/src/index.ts

// Export a single Prisma client instance if you have one in lib/prisma
import { productPrisma} from "./client/prodctDBClient";    
import { orderPrisma } from "./client/orderDBClient";
import { authPrisma } from "./client/authDBClient";


// Export all generated clients explicitly
export * as productType from "../generated/product";
export * as OrderType from "../generated/order";
export * as authType from "../generated/auth";

//  Export the clients for easy access


export {productPrisma,orderPrisma,authPrisma }