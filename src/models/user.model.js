import { MongoClient } from 'mongodb';

const client = new MongoClient('mongodb://127.0.0.1:27017');

let UserModel;
const connectUserModel = async () => {
  await client.connect();
  const db = client.db('bbg');
  UserModel = db.collection('talent');
};

export { connectUserModel, UserModel };
