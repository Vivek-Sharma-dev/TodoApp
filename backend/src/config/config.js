import dotenv from "dotenv";
dotenv.config();

const requiredEnv = [
  "SERVER_PORT",
  "DB_PORT",
  "DB_USER",
  "DB_PASSWORD",
  "DB_HOST",
  "DB_NAME",
  "JWT_SECRET",
  "REFRESH_TOKEN_EXPIRY",
  "ACCESS_TOKEN_EXPIRY",
  "NODE_ENV",
  "REFRESH_TOKEN_LIFETIME",
  "FRONTEND_URL",
  "SMTP_HOST",
  "SMTP_PORT",
  "SMTP_USER",
  "SMTP_PASSWORD",
];

for (const key of requiredEnv) {
  if (!process.env[key]) throw new Error(`${key} is not defined!`);
}
const config = {
  SERVER_PORT: Number(process.env.SERVER_PORT),
  DB_PORT: Number(process.env.DB_PORT),
  DB_USER: process.env.DB_USER,
  DB_PASSWORD: process.env.DB_PASSWORD,
  DB_HOST: process.env.DB_HOST,
  DB_NAME: process.env.DB_NAME,
  JWT_SECRET: process.env.JWT_SECRET,
  REFRESH_TOKEN_EXPIRY: process.env.REFRESH_TOKEN_EXPIRY,
  ACCESS_TOKEN_EXPIRY: process.env.ACCESS_TOKEN_EXPIRY,
  env: process.env.NODE_ENV,
  REFRESH_TOKEN_LIFETIME: Number(process.env.REFRESH_TOKEN_LIFETIME),
  FRONTEND_URL: process.env.FRONTEND_URL,
  SMTP_HOST: process.env.SMTP_HOST,
  SMTP_PORT: process.env.SMTP_PORT,
  SMTP_USER: process.env.SMTP_USER,
  SMTP_PASSWORD: process.env.SMTP_PASSWORD,
};

export default config;
