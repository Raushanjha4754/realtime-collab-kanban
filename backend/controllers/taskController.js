const Task = require("../models/Task");
const socket = require("../socket");
const User = require("../models/User");
const Action = require("../models/Action");

//create task
exports.createTask = async (req, res) => {
  try {
    const task = new Task(req.body);
    await task.save();

    await new Action({
      user: req.user.id,
      actionType: "Created Task",
      task: task._id,
    }).save();

    const io = socket.getIO();
    io.emit("taskCreated", task);

    res.status(201).json(task);
  } catch (err) {
    res.status(500).json({ msg: "Failed to create task", error: err.message });
  }
};

//get all tasks
exports.getTasks = async (req, res) => {
  try {
    const tasks = await Task.find().populate("assignedTo", "username email");
    res.json(tasks);
  } catch (err) {
    res.status(401).json({ msg: "Failed to fetch tasks", error: err.message });
  }
};

// update tasks
exports.updateTask = async (req, res) => {
  try {
    const updated = await Task.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });

    if (!updated) {
      return res.status(404).json({ msg: "Task not found" });
    }

    await new Action({
      user: req.user.id,
      actionType: "Updated Task",
      task: updated._id,
    }).save();

    const io = socket.getIO();
    io.emit("taskUpdated", updated);

    res.json(updated);
  } catch (err) {
    res.status(401).json({ msg: "Failed to update task", error: err.message });
  }
};

// Delete task
exports.deleteTask = async (req, res) => {
  try {
    const deletedTask = await Task.findByIdAndDelete(req.params.id);

    if (!deletedTask) {
      return res.status(404).json({ msg: "Task not found" });
    }

    await new Action({
      user: req.user.id,
      actionType: "Deleted Task",
      task: deletedTask._id,
    }).save();

    const io = socket.getIO();
    io.emit("taskDeleted", req.params.id);

    res.json({ msg: "Task deleted" });
  } catch (err) {
    res.status(401).json({ msg: "Failed to delete task", error: err.message });
  }
};

// smartAssign
exports.smartAssign = async (req, res) => {
  try {
    const taskId = req.params.taskId;

    // Get all users
    const users = await User.find();

    // Calculate task counts
    const taskCounts = await Promise.all(
      users.map(async (user) => {
        const count = await Task.countDocuments({
          assignedTo: user._id,
          status: { $ne: "Done" },
        });
        return { user, count };
      })
    );

    // Find user with fewest tasks
    const leastBusy = taskCounts.reduce((prev, curr) =>
      prev.count <= curr.count ? prev : curr
    );

    // Assign task
    const updatedTask = await Task.findByIdAndUpdate(
      taskId,
      { assignedTo: leastBusy.user._id },
      { new: true }
    ).populate("assignedTo");

    const io = socket.getIO();
    io.emit("taskUpdated", updatedTask);

    res.json({ msg: "Task smart assigned", task: updatedTask });
  } catch (err) {
    res.status(500).json({ msg: "Smart assign failed", error: err.message });
  }
};
