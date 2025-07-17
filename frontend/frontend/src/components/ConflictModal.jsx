import React, { useState } from "react";
import "../styles/ConflictModal.css";

const ConflictModal = ({ localTask, serverTask, onMerge, onOverwrite, onCancel }) => {
  const [mergedTask, setMergedTask] = useState({ ...serverTask });

  // Update mergedTask field by field
  const handleFieldChange = (field, value) => {
    setMergedTask((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  return (
    <div className="conflict-modal-overlay">
      <div className="conflict-modal-container">
        <h2>Conflict Detected</h2>
        <p>
          Another user updated this task. Review both versions and resolve the conflict.
        </p>

        <div className="conflict-columns">
          <div className="conflict-column">
            <h4>Your Version</h4>
            <p><b>Title:</b> {localTask.title}</p>
            <p><b>Description:</b> {localTask.description}</p>
            <p><b>Status:</b> {localTask.status}</p>
          </div>

          <div className="conflict-column">
            <h4>Server Version</h4>
            <p><b>Title:</b> {serverTask.title}</p>
            <p><b>Description:</b> {serverTask.description}</p>
            <p><b>Status:</b> {serverTask.status}</p>
          </div>

          <div className="conflict-column">
            <h4>Merge Result</h4>

            <input
              type="text"
              value={mergedTask.title}
              onChange={(e) => handleFieldChange("title", e.target.value)}
            />

            <textarea
              value={mergedTask.description}
              onChange={(e) => handleFieldChange("description", e.target.value)}
            />

            <select
              value={mergedTask.status}
              onChange={(e) => handleFieldChange("status", e.target.value)}
            >
              <option value="Todo">Todo</option>
              <option value="In Progress">In Progress</option>
              <option value="Done">Done</option>
            </select>
          </div>
        </div>

        <div className="conflict-actions">
          <button onClick={() => onMerge(mergedTask)}>Merge & Save</button>
          <button onClick={onOverwrite}>Overwrite Server</button>
          <button onClick={onCancel}>Cancel</button>
        </div>
      </div>
    </div>
  );
};

export default ConflictModal;
