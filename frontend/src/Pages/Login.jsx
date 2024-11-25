import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function Login({ setIsAuthenticated }) {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [message, setMessage] = useState('');
    const navigate = useNavigate();

    // Handle form submission
    const handleSubmit = async (e) => {
        e.preventDefault();

        const loginData = {
            email: email,
            password: password
        };

        try {
            const response = await fetch('http://localhost:1234/auth/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(loginData),
            });

            const data = await response.json(); // Parse response as JSON

            if (response.ok) {
                setMessage('Login successful!');
                setIsAuthenticated(true);  // Update parent state to true
                navigate('/home'); // Redirect to profile page
            } else {
                setMessage(data.error); // Display error message from backend
            }
        } catch (error) {
            console.error('Error:', error);
            setMessage('An error occurred during login.');
        }
    };

    return (
        <div className="login">
        <h2>Login</h2>
        <form onSubmit={handleSubmit}>
            <input
                type="email"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
            />
            <input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
            />
            <button type="submit">Login</button>
        </form>
        {message && <p>{message}</p>}
    </div>
    );
}
