import Fastify from "fastify";

const app = Fastify();

app.get("/",async(request,reply)=>{
    return reply.send("Hello from order service")
})  

const start= async()=>{
    try {
        await app.listen({port:3003})
        console.log("Order service is running on port 3002");
    } catch (error) {
        
    }
}

start()