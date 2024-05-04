import cors from "cors";
import express from "express";
import session from "express-session";
import { createServer } from "http";
import passport from "passport";
import { Server } from "socket.io";
import { passportConfig, passportFacebookConfig } from "./configs/appConfig";
import { waitForAwhile } from "./helper";
import { connectTodoModel } from "./models/todo.model";
import { connectUserModel } from "./models/user.model";
import { ilovepdfRouter } from "./route/ilovepdf";
import { loginRouter } from "./route/loginRouter";
import { sseRouter } from "./route/sse";
import { todoRouter } from "./route/todoRouter";
import { userRouter } from "./route/userRouter";

const hostname = "localhost";
const port = 5151;

const app = express();
const httpServer = createServer(app);
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cors());
app.use("/uploads", express.static("uploads"));
app.use(
  session({
    secret: "your-secret-key",
    resave: false,
    saveUninitialized: false,
  })
);
app.use(passport.initialize());
app.use(passport.session());

passportConfig();
passportFacebookConfig();

(async () => {
  await connectUserModel();
  await connectTodoModel();

  const io = new Server(httpServer, {
    cors: {
      origin: "http://localhost:3001",
    },
  });
  io.on("connection", async (socket) => {
    // ...
    console.log("================socket.id===========", socket.id);

    await waitForAwhile(1000).then(() => {
      io.emit("hello", { message: "message 1" });
    });
    await waitForAwhile(1000).then(() => {
      io.emit("hello", { message: "message 2" });
    });
    await waitForAwhile(1000).then(() => {
      io.emit("hello", { message: "message 3" });
    });
    await waitForAwhile(1000).then(() => {
      io.emit("hello", { message: "message 4" });
    });

    console.log("io.engine.clientsCount", io.engine.clientsCount);
  });

  io.on("disconnect", async () => {
    console.log("=============disconect===============");
  });

  io.on("end", function (val) {
    console.log("val----------", val);
    io.disconnect(0);
  });

  app.get("/", async (req, res) => {
    res.end("<h1>Hello World!</h1><hr>");
  });

  // app.use('/', uploadRouter);
  app.use("/", loginRouter);
  app.use("/", userRouter);
  app.use("/", todoRouter);
  app.use("/", sseRouter);
  app.use("/", ilovepdfRouter);

  httpServer.listen(port, hostname, () => {
    // eslint-disable-next-line no-console
    console.log(`Server running at http://${hostname}:${port}/`);
  });
})();
