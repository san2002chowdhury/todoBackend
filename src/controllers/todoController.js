import todoSchema from "../models/todoSchema.js";

export const createTodo = async (req, res) => {
    try {
        const { title } = req.body;

        const todo = await todoSchema.create({
            title,
            userId:req.userId
        });
        return res.status(201).json({
            success: true,
            message: "todo created successfully",
            todo
        });

    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message,
        });
    }
}

export const getTodo = async (req, res) => {
    try {
        
        const todo = await todoSchema.find({userId:req.userId});
        return res.status(201).json({
            success: true,
            message: "todo fetched successfully",
            todo
        });

    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message,
        });
    }
}