import { asyncHandler } from '../utils/asyncHandler.js';
import { apiError } from '../utils/apiError.js';
import { apiResponse } from '../utils/apiResponse.js';
import { todo } from '../models/todo.model.js'; 

const get_all_todos = asyncHandler(async (req, res) => {
    try {
        const todos = await todo.find({});
        res.status(200).json(new apiResponse(200, todos, "Todos fetched successfully"));
    } catch (error) {
        throw new apiError(400, `ERROR: ${error.message}`);
    }
});

const create_todo = asyncHandler(async (req, res) => {
    const { task, summary, status } = req.body;

    try {
        const newTodo = new todo({
            task,
            summary,
            status,
        });

        await newTodo.save();

        res.status(201).json(new apiResponse(201, newTodo, "Todo created successfully"));
    } catch (error) {
        throw new apiError(400, `ERROR: ${error.message}`);
    }
});

const update_todo = asyncHandler(async (req, res) => {
    const { id } = req.params;
    const { task, summary, status } = req.body;

    try {
        const updatedTodo = await todo.findByIdAndUpdate(
            id,
            { task, summary, status },
            { new: true, runValidators: true }
        );

        if (!updatedTodo) {
            throw new apiError(404, "Todo not found");
        }

        res.status(200).json(new apiResponse(200, updatedTodo, "Todo updated successfully"));
    } catch (error) {
        throw new apiError(400, `ERROR: ${error.message}`);
    }
});

const delete_todo = asyncHandler(async (req, res) => {
    const { id } = req.params;

    try {
        const deletedTodo = await todo.findByIdAndDelete(id);

        if (!deletedTodo) {
            throw new apiError(404, "Todo not found");
        }

        res.status(200).json(new apiResponse(200, deletedTodo, "Todo deleted successfully"));
    } catch (error) {
        throw new apiError(400, `ERROR: ${error.message}`);
    }
});

export {
    get_all_todos,
    create_todo,
    update_todo,
    delete_todo,
};
