import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
// If your Prisma file is located elsewhere, you can change the path
import { authPrisma } from "@repo/db";
import { admin } from "better-auth/plugins/admin";
export const auth = betterAuth({
    database: prismaAdapter(authPrisma, {
        provider: "postgresql", // or "mysql", "sqlite", ...etc
    }),
      pages:{
    signIn: "/signin",
    signUp: "/signup", 
    verifyRequest: "/verify-request",
    newPassword: "/new-password",
    error: "/error"
  },
  trustedOrigins:process.env.NODE_ENV==="production"?[
    process.env.APP1_URL as string,
    process.env.APP2_URL as string  
  ].filter((url): url is string => Boolean(url))
  :[
    "http://localhost:3002",
    "http://localhost:3003",
    "http://localhost:3000"
  ], 
    emailAndPassword: { 
    enabled: true, 
  }, 
  socialProviders: { 
    github: { 
      clientId: process.env.GITHUB_CLIENT_ID as string, 
      clientSecret: process.env.GITHUB_CLIENT_SECRET as string, 
    }, 
  }, 
  // your existing config
  plugins: [
    admin({
      // configure admin roles if needed
      defaultRole: "user",
      // roles: ["user", "admin"],
    }),
  ],

}); 

// export type Auth=ReturnType<typeof auth>
// export type session=Auth["$Infer"]["session"]