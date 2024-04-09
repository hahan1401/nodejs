import { MongoClient } from "mongodb";

const uri =
  "mongodb+srv://hanvietha141:hanvietha141@express-nextjs.2aezl0o.mongodb.net/?retryWrites=true&w=majority&appName=express-nextjs";

const client = new MongoClient(uri);

let TodoModel;
const connectTodoModel = async () => {
  await client.connect();
  const db = client.db("bbg");
  TodoModel = db.collection("todo");
};

export { TodoModel, connectTodoModel };
