import React, { useEffect, useState, useContext } from "react";
import { io } from "socket.io-client";
import axios from "axios";
import TaskCard from "./TaskCard";
import ActivityLog from "./ActivityLog";
import TaskForm from "./TaskForm";
import ConflictModal from "./ConflictModal";
import { AuthContext } from "../context/AuthContext";
import TaskDetailsModal from "./TaskDetailsModal";

import "../styles/KanbanBoard.css";

const KanbanBoard = () => {
  const { token, user } = useContext(AuthContext);
  const [tasks, setTasks] = useState([]);
  const [activity, setActivity] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [selectedTask, setSelectedTask] = useState(null);
  const [showActivity, setShowActivity] = useState(false);

  // Conflict state
  const [conflictTask, setConflictTask] = useState(null); // local version
  const [serverTask, setServerTask] = useState(null); // server version

  const fetchTasks = async () => {
    const res = await axios.get("http://localhost:5000/api/tasks", {
      headers: { Authorization: `Bearer ${token}` },
    });
    setTasks(res.data);
  };

  useEffect(() => {
    const socket = io("http://localhost:5000");

    fetchTasks();

    const fetchActivity = async () => {
      const res = await axios.get("http://localhost:5000/api/tasks/actions", {
        headers: { Authorization: `Bearer ${token}` },
      });

      setActivity(res.data);
    };

    fetchActivity();

    // Real-time socket updates
    socket.on("taskCreated", (task) => {
      setTasks((prev) => [...prev, task]);
      setActivity((prev) => [
        { message: `Task "${task.title}" created`, time: new Date() },
        ...prev,
      ]);
    });

    socket.on("taskUpdated", (updatedTask) => {
      setTasks((prev) =>
        prev.map((t) => (t._id === updatedTask._id ? updatedTask : t))
      );
      setActivity((prev) => [
        { message: `Task "${updatedTask.title}" updated`, time: new Date() },
        ...prev,
      ]);
    });

    socket.on("taskDeleted", (taskId) => {
      setTasks((prev) => prev.filter((t) => t._id !== taskId));
      setActivity((prev) => [
        { message: `Task deleted`, time: new Date() },
        ...prev,
      ]);
    });

    return () => socket.disconnect();
  }, [token]);

  const handleDragStart = (e, id) => {
    const task = tasks.find((t) => t._id === id);

    if (
      user.role === "admin" ||
      (task.assignedTo && task.assignedTo._id === user.id)
    ) {
      e.dataTransfer.setData("taskId", id);
    } else {
      e.preventDefault();
      alert("You can only move your own tasks.");
    }
  };

  const handleDrop = async (e, newStatus) => {
    e.preventDefault();
    const taskId = e.dataTransfer.getData("taskId");
    const task = tasks.find((t) => t._id === taskId);

    if (!task) return;

    if (
      user.role !== "admin" &&
      (!task.assignedTo || task.assignedTo._id !== user.id)
    ) {
      alert("You can't move this task.");
      return;
    }

    if (task.status !== newStatus) {
      try {
        await axios.put(
          `http://localhost:5000/api/tasks/${taskId}`,
          {
            status: newStatus,
            updatedAt: task.updatedAt, // Send version for conflict detection
          },
          { headers: { Authorization: `Bearer ${token}` } }
        );
      } catch (err) {
        if (err.response && err.response.status === 409) {
          // Conflict detected -> Open ConflictModal
          setConflictTask(task); // Local copy
          setServerTask(err.response.data.serverTask); // Server version
        } else {
          console.error(err);
        }
      }
    }
  };

  // Conflict resolution handlers

  const handleMerge = async (mergedTask) => {
    try {
      await axios.put(
        `http://localhost:5000/api/tasks/${mergedTask._id}`,
        {
          ...mergedTask,
          updatedAt: serverTask.updatedAt, // Use server's latest timestamp to avoid infinite conflict
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setConflictTask(null);
      setServerTask(null);
      fetchTasks();
    } catch (err) {
      console.error(err);
    }
  };

  const handleOverwrite = async () => {
    try {
      await axios.put(
        `http://localhost:5000/api/tasks/${conflictTask._id}`,
        {
          ...conflictTask,
          updatedAt: serverTask.updatedAt, // Use server timestamp to force overwrite
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setConflictTask(null);
      setServerTask(null);
      fetchTasks();
    } catch (err) {
      console.error(err);
    }
  };

  const handleCancelConflict = () => {
    setConflictTask(null);
    setServerTask(null);
  };

  const columns = ["Todo", "In Progress", "Done"];

  return (
    <div className="kanban-wrapper">
      {user.role === "admin" && (
        <div className="kanban-buttons">
          <button
            className="create-task-button"
            onClick={() => setShowForm(true)}
          >
            + New Task
          </button>

          <button
            className="activity-toggle-button"
            onClick={() => setShowActivity((prev) => !prev)}
          >
            {showActivity ? "Close Log" : "Activity Log"}
          </button>
        </div>
      )}

      <div className="kanban-board">
        {columns.map((status) => (
          <div
            key={status}
            onDrop={(e) => handleDrop(e, status)}
            onDragOver={(e) => e.preventDefault()}
            className="kanban-column"
          >
            <h3>{status}</h3>
            <div className="task-list">
              {tasks
                .filter((t) => t.status === status)
                .map((task) => (
                  <TaskCard
                    key={task._id}
                    task={task}
                    user={user}
                    token={token}
                    onDragStart={handleDragStart}
                    onCardClick={(task) => setSelectedTask(task)}
                    column={status}
                  />
                ))}
            </div>
          </div>
        ))}
      </div>

      <ActivityLog activity={activity} show={showActivity} />

      {showForm && (
        <TaskForm
          token={token}
          onClose={() => setShowForm(false)}
          refreshTasks={fetchTasks}
        />
      )}

      {conflictTask && serverTask && (
        <ConflictModal
          localTask={conflictTask}
          serverTask={serverTask}
          onMerge={handleMerge}
          onOverwrite={handleOverwrite}
          onCancel={handleCancelConflict}
        />
      )}

      {selectedTask && (
        <TaskDetailsModal
          task={selectedTask}
          onClose={() => setSelectedTask(null)}
          token={token}
          refreshTasks={fetchTasks}
          user={user}
        />
      )}
    </div>
  );
};

export default KanbanBoard;
