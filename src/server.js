import cors from 'cors';
import express from 'express';
import { UserModel, connectUserModel } from './models/user.model';
import { loginRouter } from './route/loginRouter';
import { uploadRouter } from './route/uploadRouter';
import { passportConfig, passportFacebookConfig } from './configs/appConfig';
import session from 'express-session';
import passport from 'passport';
import { userRouter } from './route/userRouter';
import { todoRouter } from './route/todoRouter';
import { connectTodoModel } from './models/todo.model';
import { Server } from "socket.io";

const hostname = 'localhost';
const port = 5151;

const app = express();
const httpServer = createServer(app);
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cors());
app.use('/uploads', express.static('uploads'));
app.use(
  session({
    secret: 'your-secret-key',
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

  const io = new Server(httpServer, { /* options */ });
  io.on('connection', (socket) => {
    // ...
  });

  app.get('/', async (req, res) => {
    res.end('<h1>Hello World!</h1><hr>');
  });

  app.use('/', uploadRouter);
  app.use('/', loginRouter);
  app.use('/', userRouter);
  app.use('/', todoRouter);

  app.listen(port, hostname, () => {
    // eslint-disable-next-line no-console
    console.log(`Server running at http://${hostname}:${port}/`);
  });
})();
