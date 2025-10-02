import { ENV } from "../env.js";
import mongoose from "mongoose";

const connectDB = async function (req,res) {
    try {
        const connectionInstance = await mongoose.connect(`${ENV.MONGODB_URI}`);
        console.log(`MONGODB CONNECTION SUCCESSFULL, HOST : ${connectionInstance.connection.host}`);
    }    catch(error) {
        console.error(`MONGODB CONNECTION FAILED , MESSAGE : ${error.message}`);
        process.exit(1);
    }
}

export { connectDB };