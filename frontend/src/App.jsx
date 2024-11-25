import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './Pages/Login';
import Register from './Pages/Register';
import Profile from './Pages/Profile';
import Navbar from './Components/Navbar';

function App() {
    const [isAuthenticated, setIsAuthenticated] = React.useState(false);

    // Check if the user is logged in by verifying session with the backend (optional)
    const checkAuthentication = async () => {
        const response = await fetch('http://localhost:1234/auth/session', {
            method: 'GET',
            credentials: 'include', // Include cookies for session
        });

        if (response.ok) {
            setIsAuthenticated(true);
        } else {
            setIsAuthenticated(false);
        }
    };

    // You can call this function when the app is mounted
    React.useEffect(() => {
        checkAuthentication();
    }, []);

    return (
        <Router>
            <Navbar isAuthenticated={isAuthenticated} setIsAuthenticated={setIsAuthenticated} />
            <Routes>
                <Route path="/" element={<Navigate to={isAuthenticated ? "/profile" : "/login"} />} />
                <Route path="/login" element={<Login setIsAuthenticated={setIsAuthenticated} />} />
                <Route path="/register" element={<Register />} />
                <Route path="/profile" element={isAuthenticated ? <Profile /> : <Navigate to="/login" />} />
            </Routes>
        </Router>
    );
}

export default App;
