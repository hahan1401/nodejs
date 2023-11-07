import express from 'express';
import { updateUserHandler } from '~/controllers/userController';
import { waitForAwhile } from '~/helper';
import { TodoModel } from '~/models/todo.model';
import { UserModel } from '~/models/user.model';

export const todoRouter = express.Router();

todoRouter.get('/todo/server', async (req, res) => {
  console.log('todo server reached BE');
  if (req.body) {
    // console.log('server with body:' + JSON.stringify(req.body));
  }
  const todos = await TodoModel.find({}).toArray();
  await waitForAwhile().then(() => {
    res.json(todos);
  });
});

todoRouter.get('/todo/client', async (req, res) => {
  if (req.body) {
    // console.log('client with body:' + JSON.stringify(req.body));
  }
  const todos = await UserModel.find({}).toArray();
  res.json(todos);
});

todoRouter.get('/todo/client/:id', async (req, res) => {
  const todo = await UserModel.findOne({ todoId: req.params.id });
  res.json(todo);
});

todoRouter.get('/todo/server/:id', async (req, res) => {
  const todo = await UserModel.findOne({ todoId: req.params.id });
  res.json(todo);
});


todoRouter.put('/todo/:id', updateUserHandler)
