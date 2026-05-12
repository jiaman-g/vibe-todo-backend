const express = require("express");
const Todo = require("../models/todo.schema");

const router = express.Router();

router.get("/", async (req, res) => {
  try {
    const todos = await Todo.find().sort({ createdAt: -1 });
    res.json(todos);
  } catch (error) {
    console.error("Todo 조회 실패:", error.message);
    res.status(500).json({ message: "서버 오류로 조회에 실패했습니다." });
  }
});

router.post("/", async (req, res) => {
  try {
    const { content } = req.body;
    const todo = await Todo.create({ content });
    res.status(201).json(todo);
  } catch (error) {
    if (error.name === "ValidationError") {
      return res.status(400).json({ message: error.message });
    }
    console.error("Todo 저장 실패:", error.message);
    res.status(500).json({ message: "서버 오류로 저장에 실패했습니다." });
  }
});

router.patch("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const { content, completed } = req.body;

    const updateData = {};
    if (typeof content !== "undefined") updateData.content = content;
    if (typeof completed !== "undefined") updateData.completed = completed;

    const updatedTodo = await Todo.findByIdAndUpdate(id, updateData, {
      new: true,
      runValidators: true,
    });

    if (!updatedTodo) {
      return res.status(404).json({ message: "해당 할일을 찾을 수 없습니다." });
    }

    res.json(updatedTodo);
  } catch (error) {
    if (error.name === "ValidationError" || error.name === "CastError") {
      return res.status(400).json({ message: error.message });
    }
    console.error("Todo 수정 실패:", error.message);
    res.status(500).json({ message: "서버 오류로 수정에 실패했습니다." });
  }
});

router.delete("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const deletedTodo = await Todo.findByIdAndDelete(id);

    if (!deletedTodo) {
      return res.status(404).json({ message: "해당 할일을 찾을 수 없습니다." });
    }

    res.json({ message: "할일이 삭제되었습니다." });
  } catch (error) {
    if (error.name === "CastError") {
      return res.status(400).json({ message: error.message });
    }
    console.error("Todo 삭제 실패:", error.message);
    res.status(500).json({ message: "서버 오류로 삭제에 실패했습니다." });
  }
});

module.exports = router;
