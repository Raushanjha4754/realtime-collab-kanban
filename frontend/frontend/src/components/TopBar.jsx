import React from 'react';
import { FiPlus, FiList, FiLogOut } from 'react-icons/fi';
import '../styles/TopBar.css';

const TopBar = ({ user, logout, onCreateTask, onToggleActivity }) => {
    return (
        <div className="topbar">
            <div className="profile-section">
                <img
                    src={`https://ui-avatars.com/api/?name=${user.username}&background=0D8ABC&color=fff`}
                    alt="Profile"
                    className="profile-pic"
                />
                <span className="username">{user.username}</span>
                <span className="role">({user.role})</span>
            </div>

            <div className="topbar-actions">
                {user.role === 'admin' && (
                    <>
                        <button className="topbar-btn" onClick={onCreateTask}>
                            <FiPlus /> Task
                        </button>
                        <button className="topbar-btn" onClick={onToggleActivity}>
                            <FiList /> Log
                        </button>
                    </>
                )}
                <button className="logout-btn" onClick={logout}>
                    <FiLogOut /> Logout
                </button>
            </div>
        </div>
    );
};

export default TopBar;
