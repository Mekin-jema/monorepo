import { Router } from "express";
import { auth } from "@repo/auth"; // your Better Auth instance
import {authPrisma} from "@repo/db"
import { producer } from "../utils/kafka";
import { fromNodeHeaders } from "better-auth/node";

const statusCodeMap: Record<string, number> = {
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  UNPROCESSABLE_ENTITY: 422,
  INTERNAL_SERVER_ERROR: 500,
};

const router: Router = Router();
// Get list of users (for admin / debug) — note: Better Auth may not expose a public “getAllUsers” API
router.get("/", async (req, res) => {
  // This assumes you have access to your user store (e.g. via your DB / ORM)
  // Better Auth itself is for auth operations; you still maintain user tables or SDK
  const users = await authPrisma.user.findMany({});
  res.status(200).json(users);
});

// Get single user by ID
router.get("/:id", async (req, res) => {
  const { id } = req.params;
  const user = await authPrisma.user.findUnique({ where: { id } });
  if (!user) {
    return res.status(404).json({ error: "User not found" });
  }
  res.json(user);
});

// Create a new user (sign up)
router.post("/register", async (req, res) => {
  console.log(req.body);
  const { email, password, name, role } = req.body;

  try {
    // Use Better Auth sign-up API
    const { headers, response } = await auth.api.signUpEmail({
      body: { email, password, name },
      returnHeaders: true,
    });
    // Example: manually set the role after signup
await authPrisma.user.update({
      where: { email },
      data: { role },
    });

    // forward Set-Cookie header if any
    const setCookie = headers.get("set-cookie");
    if (setCookie) {
      res.setHeader("Set-Cookie", setCookie);
    }

    // Optionally produce Kafka message
    producer.send("user.created", {
      value: {
        username: response.user?.name,
        email: response.user?.email,
      },
    });

    res.status(200).json(response);
  } catch (err: any) {
    // Convert string status to integer
    const status =
      typeof err.status === "string"
        ? statusCodeMap[err.status] ?? 500
        : err.status ?? 500;

    res.status(status).json({ error: err.message ?? "Error" });
  }
});

// Create a new user (sign up)
router.post("/login", async (req, res) => {
  console.log(req.body);
  const { email, password } = req.body;

  try {
    // Use Better Auth sign-up API
    const { headers, response } = await auth.api.signInEmail({
      body: { email, password },
      returnHeaders: true,
    });

    // forward Set-Cookie header if any
    const setCookie = headers.get("set-cookie");
    if (setCookie) {
      res.setHeader("Set-Cookie", setCookie);
    }

    // Optionally produce Kafka message
    producer.send("user.login", {
      value: {
        username: response.user?.name,
        email: response.user?.email,

      },
    });

    const session = await auth.api.getSession({
          headers: fromNodeHeaders(req.headers),
        });
        if (!session) return null;

    console.log("session jldfjl:", session);

    res.status(200).json({ response, headers, setCookie });
  } catch (err: any) {
    // Convert string status to integer
    const status =
      typeof err.status === "string"
        ? statusCodeMap[err.status] ?? 500
        : err.status ?? 500;

    res.status(status).json({ error: err.message ?? "Error" });
  }
});
// Delete user
router.delete("/:id", async (req, res) => {
  const { id } = req.params;

  try {
    // Better Auth might not have a direct “delete user by id” via API (depends on your adapter / plugin)
    // If your user store supports deletion:
    const deletedUser = await authPrisma.user.delete({ where: { id } });
    res.json(deletedUser);
  } catch (err: any) {
    res.status(500).json({ error: err.message ?? "Error deleting user" });
  }
});

export default router;
