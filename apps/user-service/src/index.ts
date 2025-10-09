import express, { NextFunction, Request, Response } from "express";
import cors from "cors";
import userRoute from "./routes/user.route.js";
import { producer } from "./utils/kafka.js";
import { toNodeHandler } from "better-auth/node";
import { auth } from "@repo/auth";
// import { isAdmin } from "@repo/auth";
const app = express();

// app.all("/api/auth/*", toNodeHandler(auth)); // For ExpressJS v4
app.all("/api/auth/*splat", toNodeHandler(auth)); //For ExpressJS v4
app.use(
  cors({
    origin: ["http://localhost:3003"],
    credentials: true,
  })
);
app.use(express.json());

app.get("/health", (req: Request, res: Response) => {
  return res.status(200).json({
    status: "ok",
    uptime: process.uptime(),
    timestamp: Date.now(),
  });
});

app.use("/users",  userRoute);

app.use((err: any, req: Request, res: Response, next: NextFunction) => {
  console.log(err);
  return res
    .status(err.status || 500)
    .json({ message: err.message || "Inter Server Error!" });
});

const start = async () => {
  try {
    await producer.connect();
    app.listen(8003, () => {
      console.log("Auth service is running on 8003");
    });
  } catch (error) {
    console.log(error);
    process.exit(1);
  }
};

start();
