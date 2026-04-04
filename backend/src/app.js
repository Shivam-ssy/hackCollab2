import express from "express";
import cors from "cors";
import morgan from "morgan";
import { logger } from "./loggers/logger.js";
import errorHandler from "./middlewares/error.middleware.js";
import cookieParser from "cookie-parser";
import swaggerUi from "swagger-ui-express";
import swaggerSpec from "./config/swagger.js";


const app = express();

app.use(
  cors({
    origin: [process.env.FRONTEND_URL],
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true,
  }),
);

app.use(express.json());

app.use(express.urlencoded({ extended: true, limit: "10mb" }));

app.use(cookieParser());

app.use(express.static("public"));

// Morgan → Winston → Console
app.use(
  morgan("dev", {
    stream: {
      write: (message) => logger.info(message.trim()),
    },
  }),
);

app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));


import userRouter from "./routes/user.route.js";
import collegeRouter from "./routes/college.route.js";
import teamRouter from "./routes/team.route.js";
import teamInviteRouter from "./routes/team.invite.route.js";
import teamMemberRouter from "./routes/team.member.route.js";

app.use("/api/v1/users", userRouter);

app.use("/api/v1/college", collegeRouter);

app.use("/api/v1/team", teamRouter);

app.use("/api/v1/team/invite", teamInviteRouter);

app.use("/api/v1/team/member", teamMemberRouter);// Error handling middleware
app.use(errorHandler)

export default app;
