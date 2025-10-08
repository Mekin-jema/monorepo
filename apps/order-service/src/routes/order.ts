import { FastifyInstance } from "fastify";
import { orderPrisma } from "@repo/db";
import { startOfMonth, subMonths } from "date-fns";
import { isAdmin, isAuthenticated } from "./middleware";

export const orderRoute = async (fastify: FastifyInstance) => {
  // 🧾 Get all orders of a specific user
  fastify.get(
    "/user-orders",
    { preHandler: isAuthenticated },
    async (request, reply) => {
      const userId = (request as any).userId;

      const orders = await orderPrisma.order.findMany({
        where: { userId },
        include: { products: true },
        orderBy: { createdAt: "desc" },
      });

      return reply.send(orders);
    }
  );

  // 🧑‍💼 Get all orders (Admin only)
  fastify.get(
    "/orders",
    { preHandler: isAdmin },
    async (request, reply) => {
      const { limit } = request.query as { limit?: number };

      const orders = await orderPrisma.order.findMany({
        include: { products: true },
        take: limit || 10,
        orderBy: { createdAt: "desc" },
      });

      return reply.send(orders);
    }
  );

  // 📊 Generate order chart data (Admin only)
  fastify.get(
    "/order-chart",
    { preHandler: isAdmin },
    async (request, reply) => {
      const now = new Date();
      const sixMonthsAgo = startOfMonth(subMonths(now, 5));

      const raw = await orderPrisma.order.groupBy({
        by: ["status"],
        _count: { status: true },
        where: {
          createdAt: {
            gte: sixMonthsAgo,
            lte: now,
          },
        },
      });

      // Custom aggregate by month
      const rawMonthly = await orderPrisma.$queryRawUnsafe<
        { year: number; month: number; total: number; successful: number }[]
      >(`
        SELECT 
          strftime('%Y', createdAt) AS year,
          strftime('%m', createdAt) AS month,
          COUNT(*) AS total,
          SUM(CASE WHEN status = 'success' THEN 1 ELSE 0 END) AS successful
        FROM Order
        WHERE createdAt BETWEEN datetime('${sixMonthsAgo.toISOString()}') AND datetime('${now.toISOString()}')
        GROUP BY year, month
        ORDER BY year ASC, month ASC;
      `);

      const monthNames = [
        "January",
        "February",
        "March",
        "April",
        "May",
        "June",
        "July",
        "August",
        "September",
        "October",
        "November",
        "December",
      ];

      const results = [];

      for (let i = 5; i >= 0; i--) {
        const d = subMonths(now, i);
        const year = d.getFullYear();
        const month = d.getMonth() + 1;

        const match = rawMonthly.find(
          (item) =>
            Number(item.year) === year &&
            Number(item.month) === month
        );

        results.push({
          month: monthNames[month - 1],
          total: match ? match.total : 0,
          successful: match ? match.successful : 0,
        });
      }

      return reply.send(results);
    }
  );
};
