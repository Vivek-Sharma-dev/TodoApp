import cookieParser from "cookie-parser";
import express from "express"
import morgan from "morgan";
import todoRouter from "./routes/todos.route.js";
import authRouter from "./routes/auth.route.js";
import { errorHandler } from "./middlewares/error.middleware.js";

const app = express()
app.use(express.json());
app.use(cookieParser())
app.use(express.urlencoded({ extended: true}));
app.use(morgan('dev'))


app.use('/api/todos', todoRouter)
app.use("/api/auth", authRouter)


app.use(errorHandler)
export default app;