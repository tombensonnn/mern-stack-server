import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import morgan from "morgan";
import "dotenv/config";
import userRouter from "./routes/user.js"
import questionRouter from "./routes/question.js"
import commentRoute from "./routes/comment.js";
const app = express();

app.use(morgan("dev"));
app.use(express.json({ limit: "30mb", extended: true }));
app.use(express.urlencoded({ limit: "30mb", extended: true }));
app.use(cors());


app.use("/users",userRouter) //http://localhost:5000/users/signup

app.use("/question",questionRouter) //http://localhost:5000/question/


const port = process.env.PORT || 5000;

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    app.listen(port, () => console.log(`Server running on port ${port}!`));
  })
  .catch((error) => console.log(`${error} did not connect`));
