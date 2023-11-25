import express from 'express';
import { addNewUserHandler, updateUserHandler } from '~/controllers/userController';
import { waitForAwhile } from '~/helper';
import { UserModel } from '~/models/user.model';

export const userRouter = express.Router();

userRouter.post('/user/add', addNewUserHandler);

userRouter.get('/user/server', async (req, res) => {
  console.log('server get user list reach BE');
  if (req.body) {
    // console.log('server with body:' + JSON.stringify(req.body));
  }
  const users = await UserModel.find({}).toArray();
  await waitForAwhile().then(() => {
    res.json(users);
  });
});

userRouter.get('/user/client', async (req, res) => {
  console.log('client list user reach BE');
  if (req.body) {
    // console.log('client with body:' + JSON.stringify(req.body));
  }
  const users = await UserModel.find({}).toArray();
  await waitForAwhile().then(() => {
    res.json(users);
  });
});

userRouter.get('/user/client/:id', async (req, res) => {
  console.log('client detail reach BE');
  const user = await UserModel.findOne({ userId: req.params.id });
  res.json(user);
});

userRouter.get('/user/server/:id', async (req, res) => {
  console.log('server detail reach BE');
  const user = await UserModel.findOne({ userId: req.params.id });
  await waitForAwhile().then(() => res.json(user))
});


userRouter.put('/user/:id', updateUserHandler)
