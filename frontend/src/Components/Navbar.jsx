import React from 'react';
import { useNavigate } from 'react-router-dom';

function Navbar({ isAuthenticated, setIsAuthenticated }) {
    const navigate = useNavigate();

    const handleLogout = async () => {
        await fetch('http://localhost:1234/auth/logout', {
            method: 'POST',
            credentials: 'include'
        });
        setIsAuthenticated(false);
        navigate('/login');
    };

    return (
        <nav>
            {isAuthenticated && <button onClick={handleLogout}>Logout</button>}
        </nav>
    );
}

export default Navbar;
