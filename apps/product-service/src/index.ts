import express from "express"
import cors from "cors"
const app = express()

app.use(cors({
    origin:[
        'http://localhost:3000',
        'http://localhost:4000'

    ],
    credentials:true
}))



app.listen(3002,()=>{
    console.log("Product service is running on port 3000");
})
