# Logic_Document.md

## 🧠 Smart Assign Logic

### **Purpose:**
The **Smart Assign** feature ensures that tasks are assigned fairly by balancing the workload among all users.

### **How It Works:**

1. When the Admin clicks **Smart Assign**, the backend fetches the list of all users.
2. For each user, the system calculates how many **active tasks** they currently have.  
   Active tasks = tasks where **status is not 'Done'** (i.e., 'Todo' or 'In Progress').
3. The system compares these counts and identifies the user with the **fewest active tasks**.
4. The selected task is then automatically assigned to that user.
5. A real-time event is emitted via **Socket.IO** to update all connected clients.

### **Benefits:**

- Prevents manual task assignment overhead.
- Ensures no single user is overloaded with tasks.
- Promotes fairness in collaborative environments.

---

## 🔄 Conflict Handling Logic

### **Purpose:**
**Conflict Handling** prevents data loss when multiple users try to update the same task at the same time.

### **Why It’s Needed:**

In collaborative apps, if two users modify the same task simultaneously without conflict handling, the **last saved version overwrites previous changes**, leading to accidental data loss.

---

### **How It Works:**

1. Each task has an **`updatedAt` timestamp** stored in MongoDB (managed by `timestamps: true` in the schema).
2. When a user updates a task, the frontend sends the task data along with the **`updatedAt` value from the client’s local copy**.
3. The backend compares:
   - **Client's `updatedAt`**  
   - **Current task's `updatedAt` in the database**

4. **If they match:**
   - The update proceeds normally.
5. **If they don’t match:**
   - The backend responds with a **409 Conflict Error**.
   - The server sends back the latest task data.

---

### **Frontend Behavior on Conflict:**

When the frontend receives the **409 Conflict**, it:

- Opens a **Conflict Modal** showing both versions:
  - **Local Version (User's changes)**
  - **Server Version (Latest from DB)**

#### **User Options:**

- **Merge Changes:**  
  Manually merge the local and server changes and submit again.
  
- **Overwrite:**  
  Forcefully save the local version, replacing the server data.

- **Cancel:**  
  Discard the local changes.

---

### **Example Scenario:**

1. **User A** changes task status to **In Progress**.
2. **User B** changes task title at the same time.
3. Both click **Save** at nearly the same time.
4. **User A’s update reaches first** → Task is updated.
5. **User B’s request now conflicts** because `updatedAt` doesn’t match → 409 Conflict is returned.
6. **User B** sees the Conflict Modal and decides how to proceed.

---

## ✅ Summary

- **Smart Assign** balances tasks by selecting the least busy user.
- **Conflict Handling** ensures no data is overwritten accidentally during concurrent task updates.
- Both features work together to support real-time, collaborative, and safe task management.

