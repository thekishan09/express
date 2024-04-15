import { configDotenv } from "dotenv";
import mongoose from "mongoose";
configDotenv({
  path: ".development.env",
});
const username = encodeURIComponent(process.env.MONGO_USERNAME);

const password = encodeURIComponent(process.env.MONGO_PASSWORD);

export default function databaseConfig() {
  mongoose
    .connect(
      "mongodb+srv://" +
        username +
        ":" +
        password +
        "@freecodecamp.l0wki4o.mongodb.net/?retryWrites=true&w=majority&appName=freecodecamp",
      { dbName: "users" }
    )
    .then(() => console.log("Database Connected"))
    .catch((err) => {
      console.log("🚀 ~ databaseConfig ~ err:", err.message);
      return;
    });
}
