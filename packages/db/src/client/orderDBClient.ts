import { PrismaClient } from "../../generated/order";

const globalForOrder = global as unknown as { orderPrisma: PrismaClient };

export const orderPrisma =
  globalForOrder.orderPrisma || new PrismaClient();

if (process.env.NODE_ENV !== "production") globalForOrder.orderPrisma = orderPrisma;
