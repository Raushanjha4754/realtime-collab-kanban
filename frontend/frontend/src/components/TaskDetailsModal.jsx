import React from 'react';
import '../styles/TaskDetailsModal.css';

const TaskDetailsModal = ({ task, onClose }) => {
  if (!task) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <h2>{task.title}</h2>
        <p><b>Description:</b> {task.description}</p>
        <p><b>Status:</b> {task.status}</p>
        <p><b>Assigned To:</b> {task.assignedTo?.username || "Unassigned"}</p>
        <p><b>Created:</b> {new Date(task.createdAt).toLocaleString()}</p>
        <p><b>Updated:</b> {new Date(task.updatedAt).toLocaleString()}</p>

        <button onClick={onClose} className="close-btn">Close</button>
      </div>
    </div>
  );
};

export default TaskDetailsModal;
