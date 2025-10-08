import {auth} from "./auth"
import {authClient} from "./client"
import { type Auth } from "better-auth"
import {isAdmin,isAuthenticated,authorize} from "./authMiddleware"

export {auth,authClient,isAdmin,isAuthenticated,authorize}    
export type {Auth}
