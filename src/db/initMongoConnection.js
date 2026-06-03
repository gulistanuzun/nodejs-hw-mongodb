import mongoose from 'mongoose';
import {setServers} from "node:dns/promises";

setServers(["8.8.8.8", "8.8.4.4"]);

export const initMongoConnection = async () => {
  const { MONGODB_USER, MONGODB_PASSWORD, MONGODB_URL, MONGODB_DB } = process.env;

  const connectionString = `mongodb+srv://${MONGODB_USER}:${MONGODB_PASSWORD}@${MONGODB_URL}/${MONGODB_DB}`;

  await mongoose.connect(connectionString);
  console.log('Mongo connection successfully established!');
};
