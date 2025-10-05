import { createAuthClient as createBetterAuthClient } from "better-auth/react"
// export const authClient = createAuthClient({
//     /** The base URL of the server (optional if you're using the same domain) */
//     baseURL: "http://localhost:3000"
// })

export const createAuthClient=()=>createBetterAuthClient()
export type signIn=ReturnType<typeof createAuthClient>["signIn"]