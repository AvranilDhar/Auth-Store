import { app } from "./app.js";
import { ENV } from "./env.js";
import { connectDB } from "./db/db.js";

connectDB()
.then(()=>{
    app.listen(ENV.PORT,()=>{
        console.log(`APP IS RUNNING @ http://localhost:${ENV.PORT}`);
    })
})
.catch((error)=>{
    console.error(`MONGODB CONNECTION FAILED , MESSAGE : ${error.message}`);
})