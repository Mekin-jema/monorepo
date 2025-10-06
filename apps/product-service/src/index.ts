import express, { NextFunction, Request, Response } from "express";
import cors from "cors";
import { toNodeHandler, fromNodeHeaders } from "better-auth/node";
import productRouter from "./routes/product.route";
import categoryRouter from "./routes/category.route";
import { consumer, producer } from "./utils/kafka.js";
import { auth } from "./utils/auth";

const app = express();

// CORS middleware
app.use(
  cors({
    origin: ["http://localhost:3002", "http://localhost:3003"],
    credentials: true,
  })
);

// Mount Better Auth handler before express.json()
app.all("/api/auth", toNodeHandler(auth));


// Only use express.json() for other routes
app.use(express.json());

app.get("/health", (req: Request, res: Response) => {
  return res.status(200).json({
    status: "ok",
    uptime: process.uptime(),
    timestamp: Date.now(),
  });
});

// Example: get user session
app.get("/api/me", async (req, res) => {
  const session = await auth.api.getSession({
    headers: fromNodeHeaders(req.headers),
  });
  return res.json(session);
});

app.use("/products", productRouter);
app.use("/categories", categoryRouter);

app.use((err: any, req: Request, res: Response, next: NextFunction) => {
  console.log(err);
  return res
    .status(err.status || 500)
    .json({ message: err.message || "Inter Server Error!" });
});

const start = async () => {
  try {
    Promise.all([await producer.connect(), await consumer.connect()]);
    app.listen(3002, () => {
      console.log("Product service is running on 3002");
    });
  } catch (error) {
    console.log(error);
    process.exit(1);
  }
};

start();
