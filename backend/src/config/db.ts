import mongoose from "mongoose";


export const connectDB = async()=>{

    try {

        await mongoose.connect(process.env.MONGODB_URI as string);
        console.log("Connected to MongoDB");
        
    } catch (error) {
        console.log(error)
        process.exit(1); // this will stop the server if there is an error in connecting to the database 1 means failure , 0 means success
    }
}