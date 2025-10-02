import { Router } from "express";

const authRouter = Router();

authRouter.get('/login',(req,res)=>{
    res.send('Hello World\n');
})

export { authRouter } ;