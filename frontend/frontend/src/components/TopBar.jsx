import React, { useState } from "react";
import { FiPlus, FiList, FiLogOut, FiChevronDown } from "react-icons/fi";
import "../styles/TopBar.css";

const TopBar = ({ user, logout, onCreateTask, onToggleActivity }) => {
  const [showProfile, setShowProfile] = useState(false);

  const handleProfileClick = () => {
    setShowProfile((prev) => !prev);
  };

  return (
    <div className="topbar">
      <div className="profile-section" onClick={handleProfileClick}>
        <img
          src={`https://ui-avatars.com/api/?name=${user.username}&background=0D8ABC&color=fff`}
          alt="Profile"
          className="profile-pic"
        />
        <div className="profile-info">
          <span className="username">{user.username}</span>
          <FiChevronDown className="dropdown-icon" />
        </div>

        {showProfile && (
          <div className="profile-dropdown">
            <p><strong>{user.username}</strong></p>
            <p>Role: {user.role}</p>
            <button onClick={logout}>Logout</button>
          </div>
        )}
      </div>

      <div className="topbar-actions">
        {user.role === "admin" && (
          <>
            <button className="topbar-btn" onClick={onCreateTask} title="Create New Task">
              <FiPlus size={16} /> Task
            </button>
            <button className="topbar-btn" onClick={onToggleActivity} title="Toggle Activity Log">
              <FiList size={16} /> Log
            </button>
          </>
        )}
        <button className="logout-btn" onClick={logout} title="Logout">
          <FiLogOut size={16} />
        </button>
      </div>
    </div>
  );
};

export default TopBar;
