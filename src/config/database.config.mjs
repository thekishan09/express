import mongoose from "mongoose";

export default function databaseConfig() {
  mongoose
    .connect("mongodb://0.0.0.0:27017/tutorial")
    .then(() => console.log("Database Connected"))
    .catch((err) => {
      console.log("🚀 ~ databaseConfig ~ err:", err.message);
      return;
    });
}
