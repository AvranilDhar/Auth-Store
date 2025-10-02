import { User } from "../models/user.model.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";

const signup = asyncHandler(async function (req,res) {
    const {
        username,
        email,
        phonenumber,
        password
    } = req.body; // in app.js --> app.use(express.json())

    if(!username || !email || !phonenumber || !password) throw new ApiError(400,"All fields are required");
    if(password.length<6 || password.length>15) throw new ApiError(400,"Password must be between 6 and 15 characters");
    if(!/^[a-zA-Z0-9]+$/.test(username)) throw new ApiError(400,"Username must contain only letters and numbers");
    if(!/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(email)) throw new ApiError(400,"Invalid email");
    if(!/^[0-9]{10}$/.test(phonenumber)) throw new ApiError(400,"Invalid phone number");

    const user = await User.findOne({email});

    if(user) throw new ApiError(400,"User already exists");

    const newUser = await User.create({username,email,phonenumber,password});

    const accessToken = newUser.generateAccessToken();
    const refreshToken = newUser.generateRefreshToken();

    await newUser.save();

    res.cookie("refreshToken",refreshToken,{
        httpOnly : true,
        secure : true,
        maxAge : 7*24*60*60*1000
    });

    const response = new ApiResponse(201,{
        _id : newUser._id,
        username : newUser.username,
        email : newUser.email,
        phonenumber : newUser.phonenumber,
        accessToken : accessToken,
    },"User created successfully");

    res.status(201).json(response);
})

const login = asyncHandler(async function (req,res) {
    const {
        identifier,
        password
    } = req.body;

    const user = await User.findOne({
        $or : [
            { email : identifier },
            { phonenumber : identifier },
            { username : identifier },
        ]
    });

    if(!user) throw new ApiError(400,`User does not exist`);

    const isPasswordMatched = await User.isPasswordValid(password);

    if(!isPasswordMatched) throw new ApiError(400 , `Invalid credentials`);

    const accessToken = user.generateAccessToken();
    const refreshToken = user.generateRefreshToken();

    res.cookie('refreshToken', refreshToken , {
        httpOnly : true,
        secure : true,
        maxAge : 7 * 24 * 60 * 60 * 1000
    });

    const response = new ApiResponse(201,{
        _id : user._id,
        username : user.username,
        email : user.email,
        phonenumber : user.phonenumber,
        accessToken : accessToken,
    },`User logged in successfully`);

    req.status(201).json(response);

})
const logout = asyncHandler(async function (req,res) {
    
})


export {
    login,
    logout,
    signup
};