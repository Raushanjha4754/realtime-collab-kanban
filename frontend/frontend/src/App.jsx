import { useContext, useState } from "react";
import { AuthContext } from "./context/AuthContext";
import Login from "./components/Login";
import Register from "./components/Register";
import KanbanBoard from "./components/KanbanBoard";
import TopBar from "./components/TopBar";

import './App.css'

const App = () => {
  const { user, token, logout } = useContext(AuthContext);
  const [showLogin, setShowLogin] = useState(true);

  if (!token) {
    return showLogin ? (
      <Login setShowLogin={setShowLogin} />
    ) : (
      <Register setShowLogin={setShowLogin} />
    );
  }

  return (
    <div className="app-container">
  <TopBar user={user} logout={logout} />
  <KanbanBoard />
</div>

  );
};

export default App;
