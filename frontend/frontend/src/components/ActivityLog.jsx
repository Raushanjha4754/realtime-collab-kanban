import React from 'react';
import '../styles/KanbanBoard.css';

const ActivityLog = ({ activity, show }) => {
    return (
        <div className={`activity-log ${show ? "show" : ""}`}>
            <h4>Activity Log</h4>
            {activity.map((act, idx) => (
                <div key={idx} className="activity-item">
                    {act.message}
                    <br />
                    <time>{new Date(act.time).toLocaleTimeString()}</time>
                </div>
            ))}
        </div>
    );
};

export default ActivityLog;
