// @ts-ignore
import { orderPrisma, OrderType } from "@repo/db";
import { producer } from "./kafka";

export const createOrder = async (order: OrderType.Prisma.OrderCreateInput) => {
     // 🧾 Validate order products
  if (!order.products || order.products.length === 0) {
    throw new Error("Order must contain at least one product.");
  }
  try {
    // 🛒 Create new order with related products
    const newOrder = await orderPrisma.order.create({
      data: {
        userId: order.userId,
        email: order.email,
        amount: order.amount,
        status: order.status,
        products: {
          create: order.products.map((p: OrderType.Product) => ({
            name: p.name,
            quantity: p.quantity,
            price: p.price,
          })),
        },
      },
      include: { products: true },
    });

    // 📡 Send order-created event to Kafka
    await producer.send("order.created", {
      value: JSON.stringify({
        email: newOrder.email,
        amount: newOrder.amount,
        status: newOrder.status,
      }),
    });

    return newOrder;
  } catch (error) {
    console.error("Error creating order:", error);
    throw error;
  }
};
