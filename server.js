import express from "express";
import { dbConnect } from "./src/config/dbConnect.js";
import dotenv from 'dotenv'
import userRoute from "./src/routes/userRoute.js";
import todoRoute from "./src/routes/todoRoute.js";
dotenv.config()

const app = express();
const port = process.env.PORT || 8001;

dbConnect();

app.use(express.json());
app.use("/user", userRoute)
app.use("/todo", todoRoute)

app.listen(port, () => {
    console.log(`<================Server Started At-${port}=================>`);
})