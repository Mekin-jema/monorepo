import Fastify from "fastify";

const app = Fastify();

const start= async()=>{
    try {
        await app.listen({port:3002})
        console.log("Order service is running on port 3002");
    } catch (error) {
        
    }
}

start()