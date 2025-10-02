import mongoose , { Schema } from "mongoose";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { ENV } from "../env.js";
const userSchema = new Schema(
    {
        username : {
            type : String,
            unique : true,
            lowercase : true,
            required : true,
            trim : true
        },
        email : {
            type : String,
            unique : true,
            lowercase : true,
            required : true,
            trim : true
        },
        phonenumber : {
            type : String,
            unique : true,
            required : true,
            trim : true
        },
        password : {
            type : String,
            required : true,
            minlength : 6,
            trim : true
        },
        isVerified: { 
            type: Boolean, 
            default: false 
        },
        emailVerificationToken: { 
            type: String 
        },
        emailVerificationExpiry: { 
            type: Date 
        },
        resetPasswordToken: { 
            type: String 
        },
        resetPasswordExpiry: { 
            type: Date 
        },
    },
    { 
        timestamps : true
    }
);


userSchema.pre('save', async function(next) {
    if (!this.isModified("password")) return next();
    try {
        this.password = await bcrypt.hash(this.password, 10);
        next();
    } catch (err) {
        next(err);
    }
});

userSchema.methods.isPasswordValid = async function (password) {
    return await bcrypt.compare(password,this.password);
}

userSchema.methods.generateAccessToken = function () {
    const payload = {
        _id : this._id,
        username : this.username,
        email : this.email,
        phonenumber : this.phonenumber,
    }
    return jwt.sign(payload, ENV.ACCESSTOKEN_SECRET , {
        expiresIn : `${ENV.ACCESSTOKEN_EXPIRY}`
    })
}

userSchema.methods.generateRefreshToken = function () {
    const payload = {
        _id : this._id,
        username : this.username,
        email : this.email,
        phonenumber : this.phonenumber,
    }
    return jwt.sign(payload, ENV.REFRESHTOKEN_SECRET , {
        expiresIn : `${ENV.REFRESHTOKEN_EXPIRY}`
    })
}

export const User = new mongoose.model("User", userSchema);