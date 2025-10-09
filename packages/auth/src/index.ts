import {auth} from "./auth"
import {authClient} from "./client"
import { type Auth } from "better-auth"
import { fromNodeHeaders } from "better-auth/node";

import {isAdmin as isAdminFastify,isAuthenticated as isAuthenticatedFastify,authorize as authorizeFastify} from "./middlewares/fastifyAuth"
import {isAdmin as isAdminHono,isAuthenticated as isAuthenticatedHono,authorize as authorizeHono} from "./middlewares/honoAuth"
import {isAdmin,isAuthenticated,authorize} from "./middlewares/expressAuth"
import {getUserFromHeaders} from "./getUser"

// Exporting all middlewares for different frameworks

export {auth,authClient,isAdminFastify,isAuthenticatedFastify,authorizeFastify,isAdminHono,isAuthenticatedHono,authorizeHono,isAdmin,isAuthenticated,authorize,fromNodeHeaders,getUserFromHeaders}    
export type {Auth}
