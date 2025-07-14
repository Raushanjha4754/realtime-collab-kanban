import React from "react";
import axios from "axios";

const TaskCard = ({ task, user, token, onDragStart }) => {
  const handleDelete = async () => {
    await axios.delete(`http://localhost:5000/api/tasks/${task._id}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
  };

  const handleSmartAssign = async () => {
    await axios.post(
      `http://localhost:5000/api/tasks/smart-assign/${task._id}`,
      {},
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );
  };

  return (
    <div
      draggable
      onDragStart={(e) => onDragStart(e, task._id)}
      style={{
        padding: "10px",
        background: "#fff",
        border: "1px solid #ccc",
        borderRadius: "8px",
        marginBottom: "10px",
        cursor: "grab",
        transition: "transform 0.2s ease",
      }}
      onMouseDown={(e) => (e.currentTarget.style.transform = "scale(1.05)")}
      onMouseUp={(e) => (e.currentTarget.style.transform = "scale(1)")}
    >
      <h4>{task.title}</h4>
      <p>{task.description}</p>
      <p>
        <b>Assigned To:</b> {task.assignedTo?.username || "Unassigned"}
      </p>
      <button
        onClick={handleDelete}
        style={{
          background: "red",
          color: "#fff",
          border: "none",
          padding: "5px",
          borderRadius: "4px",
        }}
      >
        Delete
      </button>
      <button
        onClick={handleSmartAssign}
        style={{
          background: "green",
          color: "#fff",
          border: "none",
          padding: "5px",
          borderRadius: "4px",
          marginTop: "5px",
        }}
      >
        Smart Assign
      </button>
    </div>
  );
};

export default TaskCard;
