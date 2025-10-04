import crypto from "crypto";
import { ENV } from "../env.js";
import { User } from "../models/user.model.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import 
{ 
    sendPasswordResetEmail, 
    sendPasswordSuccessEmail , 
    sendVerificationEmail , 
    sendWelcomeEmail,
} from "../emails/resend.js";
import { error } from "console";

const signup = asyncHandler(async function (req,res) {

    const {
        username,
        email,
        phonenumber,
        password
    } = req.body; // in app.js --> app.use(express.json())

    //validations

    if(!username || !email || !phonenumber || !password) 
        throw new ApiError(400,"All fields are required");

    if(password.length<6) 
        throw new ApiError(400,"Password must be greater than 6 characters");

    if(!/^[a-zA-Z0-9]+$/.test(username)) 
        throw new ApiError(400,"Username must contain only letters and numbers");

    if(!/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(email)) 
        throw new ApiError(400,"Invalid email");

    if(!/^[0-9]{10}$/.test(phonenumber)) 
        throw new ApiError(400,"Invalid phone number");


    //find user

    const user = await User.findOne({email});

    if(user) throw new ApiError(400,"User already exists");

    
    //generate otp
    const otp = Math.floor(10000+Math.random()*90000).toString();
    
    //create user
    const newUser = await User.create({
        username,
        email,
        phonenumber,
        password,
        emailVerificationToken : otp,
        emailVerificationExpiry : Date.now() + 5 * 60 * 1000 
    });

    //generate otp via email
    await sendVerificationEmail(newUser.email,otp);

    //save user
    await newUser.save();

    //generate accessToken and refreshToken
    const accessToken = newUser.generateAccessToken();
    const refreshToken = newUser.generateRefreshToken();

    
    //set cookie
    res.cookie('refreshToken', refreshToken , {
        httpOnly : true,
        secure : true,
        sameSite : "strict",
        maxAge : 7 * 24 * 60 * 60 * 1000
    });

    //send response
    const response = new ApiResponse(201,{
        _id : newUser._id,
        username : newUser.username,
        email : newUser.email,
        phonenumber : newUser.phonenumber,
        accessToken : accessToken,
    },"User created successfully");

    res.status(201).json(response);
})

const verifyEmail = async function (req,res) {

    //1. get the code from req.body
    //2. find the user using the code and the expiry date 
    //3. mark the user verified and set the code and expiry to undefined
    //4. save the updates
    //5. send the welcome email
    //6. send response

    const { code } = req.body;

    const user = await User.findOne({
        emailVerificationToken : code,
        emailVerificationExpiry : { $gt : Date.now() },
    });

    if(!user) throw new ApiError(400, "Invalid or Expired code");

    user.isVerified = true;
    user.emailVerificationToken = undefined;
    user.emailVerificationExpiry = undefined;

    await user.save();

    await sendWelcomeEmail(user.email , user.username ,`${ENV.CLIENT_URL}/`);

    const response = new ApiResponse(201, "Email verified successfully");

    res.status(201).json(response);

}

const login = asyncHandler(async function (req,res) {

    // 1. find user
    // 2. check password 
    // 3. generate access and refresh tokens
    // 4. send cookie
    // 5. send response

    const {
        email,
        password
    } = req.body;


    const user = await User.findOne({ email });

    if(!user) throw new ApiError(400,`User does not exist`);

    const isPasswordMatched = await user.isPasswordValid(password);

    if(!isPasswordMatched) throw new ApiError(400 , `Invalid credentials`);

    const accessToken = user.generateAccessToken();
    const refreshToken = user.generateRefreshToken();

    res.cookie('refreshToken', refreshToken , {
        httpOnly : true,
        secure : true,
        sameSite : "strict",
        maxAge : 7 * 24 * 60 * 60 * 1000
    });

    const response = new ApiResponse(201,{
        _id : user._id,
        username : user.username,
        email : user.email,
        phonenumber : user.phonenumber,
        accessToken : accessToken,
    },`User logged in successfully`);

    res.status(201).json(response);


})

const forgotPassword = async function (req,res) {
    // get the email from req.body
    // find the user
    // update the resetpasword token and expiry and save the user
    // send the forgot password email
    const { email } = req.body;
    const user = await User.findOne({ email });

    if(!user) throw new ApiError(400, `User does not exist`);

    user.resetPasswordToken = crypto.randomBytes(20).toString("hex");
    user.resetPasswordExpiry = Date.now() + 1 * 60 * 60 * 1000 ;

    await user.save();

    await sendPasswordResetEmail(user.email , `${ENV.CLIENT_URL}/api/auth/reset-password/${user.resetPasswordToken}`);

    const response = new ApiResponse(201,`Password reset email sent successfully`);

    res.status(201).json(response);
}

const logout = asyncHandler(async function (req,res) {

    //1. clearcookies
    //2. send a response

    res.clearCookie("refreshtoken");
    const response = new ApiResponse(201,"User logged out successfully");
    res.status(201).json(response);
})

const resetPassword = asyncHandler(async function (req,res) {
    const { token } = req.params;
    const { password } = req.body;
    const user = await User.findOne({
        resetPasswordToken : token,
        resetPasswordExpiry : { $gt : Date.now() }
    })

    if(!user) throw new ApiError(400,`User does not exist`);

    user.password = password;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpiry = undefined;

    await user.save();

    await sendPasswordSuccessEmail(user.email);

    const response = new ApiResponse(201 , `Password reset successfull`);

    res.status(201).json(response);
})

const checkAuth = asyncHandler(async function (req,res) {
    const user = User.findById(req.userId).select("-password");
    if(!user) throw new ApiError(400,`User does not exist`);

    const response = new ApiResponse(201,user);
    res.status(201).json(response);
})

export {
    login,
    logout,
    signup,
    verifyEmail,
    forgotPassword,
    resetPassword,
    checkAuth
};