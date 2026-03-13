import mongoose from "mongoose";

const mongodbUrl = process.env.MONGODB_URL;
if (!mongodbUrl) {
  throw new Error("Connection string does not exist");
}

let cache = global.mongoose;

if (!cache) {
  cache = global.mongoose = { conn: null, promise: null };
}

const connectDB = async () => {
  if (cache.conn) {
    return cache.conn;
  }
  if (!cache.promise) {
    cache.promise = mongoose
      .connect(mongodbUrl)
      .then((conn) => conn.connection);
  }
  try {
    const conn = await cache.promise;
    return conn;
  } catch (error) {
    console.log(error);
  }
};

export default connectDB;