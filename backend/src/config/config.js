import dotenv from 'dotenv';
dotenv.config()

if(!process.env.SERVER_PORT) throw new Error("Server Port is not find");

const config = {
    SERVER_PORT: process.env.SERVER_PORT
}


export default config;