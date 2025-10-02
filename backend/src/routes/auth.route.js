import { Router } from "express";
import { signup,login,logout,verifyEmail } from "../controllers/auth.controller.js";

const authRouter = Router();

authRouter.post('/signup',signup);
authRouter.post('/login',login);
authRouter.post('/logout',logout);
authRouter.post('/verifyEmail',verifyEmail);

export { authRouter } ;