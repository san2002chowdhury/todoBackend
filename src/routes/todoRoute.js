import express from "express";
import { createTodo, deleteTodo, getAllTodo, updateTodo } from "../controllers/todoController.js";
import { hasToken } from "../middlewares/hasToken.js";

const todoRoute = express.Router();

todoRoute.post("/create", hasToken, createTodo);
todoRoute.get("/getAll", hasToken, getAllTodo);
todoRoute.patch("/update/:id", hasToken, updateTodo)
todoRoute.delete("/delete/:id", hasToken, deleteTodo);

export default todoRoute;