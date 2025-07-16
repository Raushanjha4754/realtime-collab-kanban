import { useContext, useState } from 'react';
import { AuthContext } from './context/AuthContext';
import Login from './components/Login';
import Register from './components/Register';
import KanbanBoard from './components/KanbanBoard';

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
            <button
                onClick={logout}
                style={{ position: 'absolute', top: 10, right: 10 }}
            >
                Logout ({user.role})
            </button>

            <KanbanBoard user={user} token={token} /> {/* ✅ Pass user and token */}
        </>
    );
};

export default App;
