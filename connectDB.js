import dotenv from 'dotenv';
import mongoose, { mongo } from 'mongoose';
dotenv.config();

if(!process.env.MONGODB_URI){
    throw new Error("Please enter MONGODB_URI in dotenv file")
}


async function connectDB() {

    try{
        await mongoose.connect(process.env.MONGODB_URI);
        console.log("Mongodb connected");
    }
    catch(error){
        console.log('Mongodb connection error',error);
        process.exit(1);
    }
    
    
}

export default  connectDB;