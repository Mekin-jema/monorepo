import Fastify from "fastify";
import { orderRoute } from "./routes/order.js";
import { consumer, producer } from "./utils/kafka.js";
import { runKafkaSubscriptions } from "./utils/subscriptions.js";
import {  isAuthenticatedFastify } from "@repo/auth";
import { connectOrderDB } from "./utils/connectDb.js";

const fastify = Fastify();


fastify.get("/health", (request, reply) => {
  return reply.status(200).send({
    status: "ok",
    uptime: process.uptime(),
    timestamp: Date.now(),
  });
});

fastify.get("/test", { preHandler: isAuthenticatedFastify }, (request, reply) => {
  return reply.send({
    message: "Order service is authenticated!",
    userId: request.userId,
  });
});

fastify.register(orderRoute);

const start = async () => {
  try {
    Promise.all([
      await connectOrderDB(),
      await producer.connect(),
      await consumer.connect(),
    ]);
    await runKafkaSubscriptions();
    await fastify.listen({ port: 8001 });
    console.log("Order service is running on port 8001");
  } catch (err) {
    console.log(err);
    process.exit(1);
  }
};
start();
