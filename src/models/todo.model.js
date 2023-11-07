import { MongoClient } from 'mongodb';

const client = new MongoClient('mongodb://127.0.0.1:27017');

let TodoModel;
const connectTodoModel = async () => {
  await client.connect();
  const db = client.db('bbg');
  TodoModel = db.collection('todo');
};

export { connectTodoModel, TodoModel };
