import express from "express";
import cookieparser from "cookie-parser";
import { authRouter } from "./routes/auth.route.js";
const app  = express();

app.use(express.json({
    limit : "10kb",
}));
app.use(express.urlencoded({
    extended : true,
    limit : "10kb",
}));
app.use(cookieparser());

app.use('/api/auth',authRouter);

export { app };