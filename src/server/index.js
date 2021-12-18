import routes from "./routes/sequence";
import { db } from "./config";
import mongoose from "mongoose";
import express from "express";
import multer from "multer";

mongoose.Promise = global.Promise;

//Set up default mongoose connection
const mongoDB = `mongodb+srv://${db.username}:${db.password}@${db.url}/${db.name}?retryWrites=true&w=majority`;

mongoose
  .connect(mongoDB, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log("connected"))
  .catch((err) => console.log(err));

//Get the default connection
const database = mongoose.connection;

//Bind connection to error event (to get notification of connection errors)
database.on("error", console.error.bind(console, "MongoDB connection error:"));

const PORT = process.env.PORT || 3001;

const app = express();

app.use(express.json());

// for parsing application/x-www-form-urlencoded
app.use(express.urlencoded({ extended: true }));

app.use(multer().any());
app.use(express.static("public"));

const router = express.Router();
routes(router);
app.use("/api", router);

app.listen(PORT, () => {
  console.log(`Server listening on ${PORT}`);
});
