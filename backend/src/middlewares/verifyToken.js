import jwt from "jsonwebtoken";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ENV } from "../env.js";

const verifyToken = asyncHandler(async function (req,res,next) {

    // get the refreshtoken from req.cookies
    // verify the refresh token
    // userId

    const refreshToken = req.cookies.refreshToken ;
    if(!refreshToken) throw new ApiError (400 ,`Unauthorized - no token provided`);

    const decoded = jwt.verify(refreshToken,ENV.REFRESHTOKEN_SECRET);
    if(!decoded) throw new ApiError (400 ,`Unauthorized - invalid token`);

    req.userId = decoded.userId
    next();
})

export { verifyToken };