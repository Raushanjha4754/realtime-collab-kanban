import React, { useState } from "react";
import Login from "./components/Login";
import Register from "./components/Register";
import KanbanBoard from "./components/KanbanBoard";

const App = () => {
  const [token, setToken] = useState(localStorage.getItem("token") || "");
  const [user, setUser] = useState(
    localStorage.getItem("user")
      ? JSON.parse(localStorage.getItem("user"))
      : null
  );
  const [showLogin, setShowLogin] = useState(true);

  const handleLogout = () => {
    setToken("");
    setUser(null);
    localStorage.clear();
  };

  if (!token) {
    return showLogin ? (
      <Login
        setUser={setUser}
        setToken={setToken}
        setShowLogin={setShowLogin}
      />
    ) : (
      <Register setShowLogin={setShowLogin} />
    );
  }

  // ✅ FIX: Add return here
  return (
    <>
      <button
        onClick={handleLogout}
        style={{ position: "absolute", top: 10, right: 10 }}
      >
        Logout
      </button>
      <KanbanBoard token={token} user={user} />
    </>
  );
};

export default App;
