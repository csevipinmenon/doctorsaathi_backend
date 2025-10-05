import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import logger from "./logger.js";
import morgan from "morgan";
import bodyParser from "body-parser";

const app = express();

const morganFormat = ":method :url :status :response-time ms";

app.use(
  morgan(morganFormat, {
    stream: {
      write: (message) => {
        const logObject = {
          method: message.split(" ")[0],
          url: message.split(" ")[1],
          status: message.split(" ")[2],
          responseTime: message.split(" ")[3],
        };
        logger.info(JSON.stringify(logObject));
      },
    },
  })
);

app.use(
  cors({
    origin: process.env.CORS_ORIGIN,
    credentials: true,
  })
);

app.use(express.json({ limit: "16kb" }));
app.use(express.urlencoded({ extended: true, limit: "16kb" }));
app.use(express.static("public"));
app.use(cookieParser());
app.use(bodyParser.json());

//import user  routes

import userRouter from "./routes/user.auth.routes.js";

// import admin routes
import adminRouter from "./routes/admin.auth.route.js";

// import doctor routes

import doctorRouter from "./routes/doctor.auth.route.js";

//use routes user routes

app.use("/doctorsaathi/user", userRouter);

//use admin routes
app.use("/doctorsaathi/admin", adminRouter);

// use doctor routes

app.use("/doctorsaathi/doctor", doctorRouter);

app.get("/vipin", (req, res) => {
  res.send({
    success: true,
    heath: "All fine!",
    process_By:"vipin Kumar"
  });
});

export default app;
