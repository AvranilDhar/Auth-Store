import { Router } from "express";
import { 
    signup, 
    login, 
    logout,
    verifyEmail, 
    forgotPassword,
    resetPassword,
    checkAuth
 } from "../controllers/auth.controller.js";
import { verifyToken } from "../middlewares/verifyToken.js";

const authRouter = Router();


authRouter.get('/check-auth',verifyToken,checkAuth);

authRouter.post('/signup',signup);
authRouter.post('/login',login);
authRouter.post('/logout',logout);
authRouter.post('/verify-email',verifyEmail);
authRouter.post('/forgot-password',forgotPassword);
authRouter.post('/reset-password/:token',resetPassword);



export { authRouter } ;