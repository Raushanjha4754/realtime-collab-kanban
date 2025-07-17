import { useContext, useState } from "react";
import { AuthContext } from "./context/AuthContext";
import Login from "./components/Login";
import Register from "./components/Register";
import KanbanBoard from "./components/KanbanBoard";

import './App.css'

const App = () => {
  const { user, token } = useContext(AuthContext);
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
      <KanbanBoard />
    </div>
  );
};

export default App;
