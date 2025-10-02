import "dotenv/config";

const ENV = {
    PORT : process.env.PORT || 5001,
    MONGODB_URI : process.env.MONGODB_URI,
}

export { ENV };