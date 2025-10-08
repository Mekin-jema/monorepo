import {auth} from "./auth"
import {authClient} from "./client"
import { type Auth } from "better-auth"
import { fromNodeHeaders } from "better-auth/node";

import {isAdmin,isAuthenticated,authorize} from "./authMiddleware"

export {auth,authClient,isAdmin,isAuthenticated,authorize,fromNodeHeaders}    
export type {Auth}
