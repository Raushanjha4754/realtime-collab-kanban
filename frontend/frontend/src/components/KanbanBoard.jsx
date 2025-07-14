import React, { useEffect, useState } from 'react';
import { io } from 'socket.io-client';
import axios from 'axios';
import TaskCard from './TaskCard';
import ActivityLog from './ActivityLog';
import '../styles/KanbanBoard.css';

const KanbanBoard = ({ token, user }) => {
    const [tasks, setTasks] = useState([]);
    const [activity, setActivity] = useState([]);

    useEffect(() => {
        const socket = io('http://localhost:5000');

        const fetchTasks = async () => {
            const res = await axios.get('http://localhost:5000/api/tasks', {
                headers: { Authorization: `Bearer ${token}` }
            });
            setTasks(res.data);
        };

        const fetchActivity = async () => {
            const res = await axios.get('http://localhost:5000/api/actions', {
                headers: { Authorization: `Bearer ${token}` }
            });
            setActivity(res.data);
        };

        fetchTasks();
        fetchActivity();

        socket.on('taskCreated', (task) => {
            setTasks(prev => [...prev, task]);
            setActivity(prev => [{ message: `Task "${task.title}" created`, time: new Date() }, ...prev]);
        });

        socket.on('taskUpdated', (updatedTask) => {
            setTasks(prev => prev.map(t => t._id === updatedTask._id ? updatedTask : t));
            setActivity(prev => [{ message: `Task "${updatedTask.title}" updated`, time: new Date() }, ...prev]);
        });

        socket.on('taskDeleted', (taskId) => {
            setTasks(prev => prev.filter(t => t._id !== taskId));
            setActivity(prev => [{ message: `Task deleted`, time: new Date() }, ...prev]);
        });

        return () => socket.disconnect();
    }, []);

    const handleDragStart = (e, id) => {
        e.dataTransfer.setData('taskId', id);
    };

    const handleDrop = async (e, newStatus) => {
        e.preventDefault();
        const taskId = e.dataTransfer.getData('taskId');
        const task = tasks.find(t => t._id === taskId);

        if (task.status !== newStatus) {
            await axios.put(`http://localhost:5000/api/tasks/${taskId}`,
                { ...task, status: newStatus },
                { headers: { Authorization: `Bearer ${token}` } }
            );
        }
    };

    const columns = ['Todo', 'In Progress', 'Done'];

    return (
        <div className="kanban-wrapper">
            <div className="kanban-board">
                {columns.map(status => (
                    <div
                        key={status}
                        onDrop={(e) => handleDrop(e, status)}
                        onDragOver={(e) => e.preventDefault()}
                        className="kanban-column"
                    >
                        <h3>{status}</h3>
                        {tasks.filter(t => t.status === status).map(task => (
                            <TaskCard key={task._id} task={task} user={user} token={token} onDragStart={handleDragStart} />
                        ))}
                    </div>
                ))}
            </div>

            <ActivityLog activity={activity} />
        </div>
    );
};

export default KanbanBoard;
