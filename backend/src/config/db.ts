import mongoose from "mongoose";


export const connectDB = async()=>{

    try {
        const mongoURI = process.env.MONGODB_URI as string;
        if (!mongoURI) {
            throw new Error("MONGODB_URI is not defined in environment variables");
        }
        await mongoose.connect(mongoURI);
        console.log("Connected to MongoDB");
        
    } catch (error) {
        console.log(error)
        process.exit(1); // this will stop the server if there is an error in connecting to the database 1 means failure , 0 means success
    }
}