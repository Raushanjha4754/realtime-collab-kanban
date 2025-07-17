import { useContext, useState } from "react";
import { AuthContext } from "./context/AuthContext";
import Login from "./components/Login";
import Register from "./components/Register";
import KanbanBoard from "./components/KanbanBoard";
import TopBar from "./components/TopBar";

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
    <>
      <TopBar user={user} logout={logout} />

      <KanbanBoard />
    </>
  );
};

export default App;
