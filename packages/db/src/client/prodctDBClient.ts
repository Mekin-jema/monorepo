import { PrismaClient } from "../../generated/product";

const globalForProduct = global as unknown as { productPrisma: PrismaClient };

export const productPrisma =
  globalForProduct.productPrisma || new PrismaClient();

if (process.env.NODE_ENV !== "production") globalForProduct.productPrisma = productPrisma;
