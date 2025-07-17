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
    const task = await Task.findById(req.params.id);

    if (!task) return res.status(404).json({ msg: "Task not found" });

    const isAdmin = req.user.role === "admin";
    const isOwner = task.assignedTo?.toString() === req.user.id;

    if (!isAdmin && !isOwner) {
      return res.status(403).json({ msg: "Not allowed to update this task" });
    }

    if (!isAdmin) {
      if (!req.body.status) {
        return res.status(400).json({ msg: "Only status update allowed" });
      }

      // ✅ Prevent unassignment
      task.status = req.body.status; 
    } else {
      // ✅ Admin updates only provided fields
      if (req.body.title !== undefined) task.title = req.body.title;
      if (req.body.description !== undefined) task.description = req.body.description;
      if (req.body.status !== undefined) task.status = req.body.status;
      if (req.body.assignedTo !== undefined) task.assignedTo = req.body.assignedTo;
    }

    const clientUpdatedAt = req.body.updatedAt;

if (clientUpdatedAt && new Date(clientUpdatedAt).getTime() !== new Date(task.updatedAt).getTime()) {
    return res.status(409).json({
        msg: "Conflict detected",
        serverTask: task
    });
}

const updated = await task.save();


    await new Action({
      user: req.user.id,
      actionType: "Updated Task",
      task: updated._id,
    }).save();

    const io = socket.getIO();
    io.emit("taskUpdated", updated);

    res.json(updated);
  } catch (err) {
    res.status(500).json({ msg: "Failed to update task", error: err.message });
  }
};




// Delete task
exports.deleteTask = async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);

    if (!task) return res.status(404).json({ msg: "Task not found" });

    const isAdmin = req.user.role === "admin";

    if (!isAdmin) {
      return res.status(403).json({ msg: "Only admin can delete tasks" });
    }

    await Task.findByIdAndDelete(req.params.id);

    await new Action({
      user: req.user.id,
      actionType: "Deleted Task",
      task: task._id,
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

// Claim Task Controller
exports.claimTask = async (req, res) => {
  try {
    const task = await Task.findById(req.params.taskId);

    if (!task) {
      return res.status(404).json({ msg: "Task not found" });
    }

    if (task.assignedTo) {
      return res.status(400).json({ msg: "Task is already assigned" });
    }

    task.assignedTo = req.user.id;
    await task.save();

    await new Action({
      user: req.user.id,
      actionType: "Claimed Task",
      task: task._id,
    }).save();

    const io = socket.getIO();
    io.emit("taskUpdated", task);

    res.json({ msg: "Task claimed successfully", task });
  } catch (err) {
    res.status(500).json({ msg: "Failed to claim task", error: err.message });
  }
};
