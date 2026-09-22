import dotenv from 'dotenv';
dotenv.config()

if(!process.env.SERVER_PORT ) throw new Error("Server Port is not find");
if(!process.env.DB_PORT) throw new Error("DB Port is not find");
if(!process.env.DB_USER) throw new Error("DB User is not find");
if(!process.env.DB_PASSWORD) throw new Error("DB Password is not find");
if(!process.env.DB_HOST) throw new Error("DB Host is not find");
if(!process.env.DB_NAME) throw new Error("DB Name is not find");
if(!process.env.JWT_SECRET) throw new Error("JWT_SECRET is not find")
if(!process.env.REFRESH_TOKEN_EXPIRY) throw new Error("REFRESH_TOKEN_EXPIRY is not find")
if(!process.env.ACCESS_TOKEN_EXPIRY) throw new Error("ACCESS_TOKEN_EXPIRY is not find")
if(!process.env.NODE_ENV) throw new Error("NODE_ENV is not find")

const config = {
    SERVER_PORT: process.env.SERVER_PORT,
    DB_PORT: process.env.DB_PORT,
    DB_USER: process.env.DB_USER,
    DB_PASSWORD: process.env.DB_PASSWORD,
    DB_HOST: process.env.DB_HOST,
    DB_NAME: process.env.DB_NAME,
    JWT_SECRET: process.env.JWT_SECRET,
    REFRESH_TOKEN_EXPIRY: process.env.REFRESH_TOKEN_EXPIRY,
    ACCESS_TOKEN_EXPIRY: process.env.ACCESS_TOKEN_EXPIRY,
    ENV: process.env.NODE_ENV,
}


export default config;