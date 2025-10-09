import "crypto"; 
import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { authPrisma } from "@repo/db";
import { admin } from "better-auth/plugins/admin";

// Manually define your DB connection and credentials
const POSTGRES_URL = "postgresql://postgres_user:postgres_pass@localhost:5432/authdb?schema=public";
const APP1_URL = "http://localhost:3002";
const APP2_URL = "http://localhost:3003";
const GITHUB_CLIENT_ID = "Ov23liISBT7jSwdqAxqg";
const GITHUB_CLIENT_SECRET = "bdcb4ee56b220e20e8da3d0cefb38c102490ae73";

export const auth = betterAuth({
  database: prismaAdapter(authPrisma, {
    provider: "postgresql"

  }),
  pages: {
    signIn: "/signin",
    signUp: "/signup",
    verifyRequest: "/verify-request",
    newPassword: "/new-password",
    error: "/error",
  },
  trustedOrigins: [APP1_URL, APP2_URL, "http://localhost:3000"],
  emailAndPassword: { enabled: true },
  socialProviders: {
    github: {
      clientId: GITHUB_CLIENT_ID,
      clientSecret: GITHUB_CLIENT_SECRET,
    },
  },
  // plugins: [
  //   admin({
  //     defaultRole: "user",
  //   }),
  // ],
});

console.log("Better Auth initialized manually:");
console.log("POSTGRES URL:", POSTGRES_URL);
console.log("Trusted Origins:", [APP1_URL, APP2_URL]);
