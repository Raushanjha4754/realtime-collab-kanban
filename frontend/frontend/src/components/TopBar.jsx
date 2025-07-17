import React from 'react';
import '../styles/TopBar.css'; // Optional: For custom styling

const TopBar = ({ user, logout }) => {
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

            <button className="logout-btn" onClick={logout}>
                Logout
            </button>
        </div>
    );
};

export default TopBar;
