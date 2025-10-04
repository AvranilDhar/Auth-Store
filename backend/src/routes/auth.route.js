import { Router } from "express";
import { 
    signup, 
    login, 
    logout,
    verifyEmail, 
    forgotPassword,
    resetPassword,
 } from "../controllers/auth.controller.js";

const authRouter = Router();

authRouter.post('/signup',signup);
authRouter.post('/login',login);
authRouter.post('/logout',logout);
authRouter.post('/verify-email',verifyEmail);
authRouter.post('/forgot-password',forgotPassword);
authRouter.post('/reset-password/:token',resetPassword);



export { authRouter } ;