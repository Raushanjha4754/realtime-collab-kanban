# Real-Time Collaborative Kanban Board

## 🚀 Project Overview

This is a **Real-Time Collaborative Kanban Board Web App** built as part of the internship assignment.  
It allows users to manage tasks collaboratively with features like:

- **Role-based permissions** (Admin & User)
- **Real-time updates** using **Socket.IO**
- **Smart Assign** feature for workload balancing
- **Conflict Handling** to manage race conditions in task updates
- **Activity Log** to track the latest actions

---

## 🛠 Tech Stack

### **Frontend:**

- **React.js (Vite)**
- **Socket.IO-Client**
- **Axios**
- **React Icons**
- **CSS Modules / Custom CSS**

### **Backend:**

- **Node.js + Express.js**
- **MongoDB + Mongoose**
- **Socket.IO (Real-time updates)**
- **JWT Authentication**
- **Multer (for image upload, if needed)**

---

## ⚙️ Setup & Installation

### **1️⃣ Clone the Repository**

```
git clone https://github.com/Monib007/realtime-collab-kanban.git
cd realtime-collab-kanban
```

2️⃣ Backend Setup

```
cd backend
npm install
```

Run Backend
```
npm run dev
```
3️⃣ Frontend Setup
```
cd frontend
npm install
npm run dev
```

## 🌐 Live Deployment

| Part           | Link                  |
|----------------|-----------------------|
| **Frontend**   | [Live Frontend]((https://realtime-collab-kanban.vercel.app/)) |
| **Backend**    | [Live Backend](https://realtime-collab-kanban.onrender.com/)   |
| **Demo Video** | [Watch Demo](https://your-demo-link.com)        |
| **Logic Doc**  | [Logic_Document.md](https://github.com/Monib007/realtime-collab-kanban/blob/main/Logic_Document.md) |


🔑 Environment Variables
Frontend
Create .env in frontend/
```
VITE_API_URL=https://your-backend-link.com/api
```
Backend
Create .env in backend/
```
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
```

✨ Features & Usage Guide
## Login/Register
## Admin can:
- Create, assign, and delete tasks
- Use Smart Assign for balanced task distribution
- View activity logs (last 20 actions)

## User can:
- Claim unassigned tasks
- Move own tasks between columns

## Kanban Board
- Drag-and-drop to change task status
- Real-time sync across clients via Socket.IO

## Activity Log
- Shows the last 20 actions (create, update, delete, claim, assign)

## Smart Assign
- Admin can assign tasks to the user with the fewest active tasks (Todo/In Progress)
- Ensures balanced workload distribution

## Conflict Handling
- If two users try to update the same task concurrently, a conflict modal appears.
- Options:
  - Merge Changes
  - Overwrite
  - Cancel

🧠 Smart Assign & Conflict Handling Logic
## Smart Assign
-The backend calculates active task counts for each user.
- It selects the user with the least number of ongoing tasks.
- Task is assigned automatically to that user when Admin clicks Smart Assign.

## Conflict Handling
- Every task has a updatedAt timestamp.
- When a user tries to update a task, the backend compares:
  - Client's updatedAt vs Server's updatedAt
- If they don't match → 409 Conflict Error is returned.
- Frontend shows a Conflict Modal with options to:
  - Merge changes manually
  - Overwrite the server version
  - Cancel the operation

📹 Demo Video
Click to Watch Demo Video

📄 Logic Document
Logic_Document.md

## 📬 Submission Summary

| Item              | Link |
|------------------|------|
| **GitHub Repo**   | [GitHub Repository](https://github.com/Monib007/realtime-collab-kanban) |
| **Live Frontend** | [Live Frontend](https://realtime-collab-kanban.vercel.app/) |
| **Live Backend**  | [Live Backend](https://realtime-collab-kanban.onrender.com/)   |
| **Demo Video**    | [Watch Demo](https://your-demo-link.com)        |
| **Logic Document**| [Logic_Document.md](https://github.com/Monib007/realtime-collab-kanban/blob/main/Logic_Document.md) |


💡 Notes
- Do not commit secrets (JWT keys, Mongo URI).
- Ensure CORS is handled properly in backend.
- Real-time events are managed via Socket.IO.

✍️ Author
Monib Kumar Singha
B.Tech, NIT Jalandhar
