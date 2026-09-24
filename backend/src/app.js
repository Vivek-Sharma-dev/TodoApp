import cookieParser from "cookie-parser";
import express from "express";
import morgan from "morgan";
import todoRouter from "./routes/todos.route.js";
import authRouter from "./routes/auth.route.js";
import { errorHandler } from "./middlewares/error.middleware.js";
import cors from "cors";
import helmet from "helmet";
import config from "./config/config.js";

const app = express();
app.use(helmet());
app.use(
  cors({
    origin: config.FRONTEND_URL,
    credentials: true,
  }),
);
app.use(express.json());
app.use(cookieParser());
app.use(express.urlencoded({ extended: true }));
app.use(morgan("dev"));

app.use("/api/todos", todoRouter);
app.use("/api/auth", authRouter);

app.use(errorHandler);
export default app;
