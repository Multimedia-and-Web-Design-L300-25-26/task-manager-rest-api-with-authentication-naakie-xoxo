import express from "express";
import Task from "../models/Task.js";
import authMiddleware from "../middleware/authMiddleware.js";

const router = express.Router();

// Apply auth middleware
router.use(authMiddleware);

// POST /api/tasks
// - Create task
router.post("/", async (req, res) => {
  try {
    const { title, description } = req.body;
    //-attach owner = req.user._id
    const task = await Task.create({
      title,
      description,
      owner: req.user._id
    });

    res.status(201).json(task);
  } catch (error) {
    res.status(500).json({ message: "Server error creating task" });
  }
});

// GET /api/tasks
router.get("/", async (req, res) => {
  // - Return only tasks belonging to req.user
  try {
    const tasks = await Task.find({ owner: req.user._id });
    
    res.status(200).json(tasks);
  } catch (error) {
    res.status(500).json({ message: "Server error fetching tasks" });
  }
});

// DELETE /api/tasks/:id
router.delete("/:id", async (req, res) => {
  // - Check ownership
  try {
    const task = await Task.findById(req.params.id);
    if (!task) {
      return res.status(404).json({ message: "Task not found" });
    }
    if (task.owner.toString() !== req.user._id.toString()) {
      return res.status(401).json({ message: "Not authorized to delete this task" });
    }
  // - Delete task
    await task.deleteOne();
    
    res.status(200).json({ message: "Task successfully deleted" });
  } catch (error) {
    res.status(500).json({ message: "Server error deleting task" });
  }
});

export default router;