import { createServer } from "http";
import app from "./src/app";
import { connectDB } from "./src/config/db";
import { initializeSocket } from "./src/utils/socket";

const port = process.env.PORT || 5000;

const httpServer = createServer(app);

initializeSocket(httpServer);

connectDB().then(()=>{
    httpServer.listen(port,()=>{
        console.log(`Server up and running at the port... ${port}`)
    })
}).catch((err)=>{
    console.log('Failed to connect to the database',err);
    process.exit(1);
})