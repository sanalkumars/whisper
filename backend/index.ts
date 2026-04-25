import app from "./src/app";
import { connectDB } from "./src/config/db";

const port = process.env.PORT || 5000;

connectDB().then(()=>{
    app.listen(port,()=>{
        console.log(`Server up and running at the port... ${port}`)
    })
}).catch((err)=>{
    console.log('Failed to connect to the database',err);
})