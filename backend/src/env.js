import "dotenv/config";

const ENV = {
    PORT : process.env.PORT || 5001,
    MONGODB_URI : process.env.MONGODB_URI,
    NODE_ENV : process.env.NODE_ENV,
    ACCESSTOKEN_SECRET : process.env.ACCESSTOKEN_SECRET,
    REFRESHTOKEN_SECRET : process.env.REFRESHTOKEN_SECRET,
    ACCESSTOKEN_EXPIRY : process.env.ACCESSTOKEN_EXPIRY,
    REFRESHTOKEN_EXPIRY : process.env.REFRESHTOKEN_EXPIRY,
    RESEND_KEY : process.env.RESEND_KEY,
    CLIENT_URL : process.env.CLIENT_URL
}

export { ENV };