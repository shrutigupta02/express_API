import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function Register() {
    const [values, setValues] = useState({
        firstName: '',
        lastName: '',
        email: '',
        password: '',
        number: ''
    });
    const [message, setMessage] = useState('');
    const navigate = useNavigate();

    // handle form submission
    const handleSubmit = async (e) => {
        e.preventDefault();

        const userData = {
            first_name: values.firstName,
            last_name: values.lastName,
            email: values.email,
            password: values.password,
            number: values.number
        };

        try {
            const response = await fetch('http://localhost:1234/add', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(userData), // Ensure it's stringified
            });

            const data = await response.json();
            if (response.ok) {
                setMessage(data.message);
                navigate('/profile');
            } else {
                setMessage(data.error);
            }
        } catch (error) {
            console.error('Error:', error);
            setMessage('An error occurred while registering the user.');
        }
    };

    // handle input changes
    const handleChange = (event) => {
        const { name, value } = event.target;
        setValues((prevValues) => ({
            ...prevValues,
            [name]: value
        }));
    };

    return (
        <div>
            <h2>Register New User</h2>
            <form onSubmit={handleSubmit}>
                <input
                    type="text"
                    name="firstName"
                    placeholder="First Name"
                    value={values.firstName}
                    onChange={handleChange}
                    required
                />
                <input
                    type="text"
                    name="lastName"
                    placeholder="Last Name"
                    value={values.lastName}
                    onChange={handleChange}
                    required
                />
                <input
                    type="email"
                    name="email"
                    placeholder="Email"
                    value={values.email}
                    onChange={handleChange}
                    required
                />
                <input
                    type="password"
                    name="password"
                    placeholder="Password"
                    value={values.password}
                    onChange={handleChange}
                    required
                />
                <input
                    type="text"
                    name="number"
                    placeholder="Phone Number"
                    value={values.number}
                    onChange={handleChange}
                    required
                />
                <button type="submit">Register</button>
            </form>
            {message && <p>{message}</p>}
            <p>Already a user?</p>
            <p style={{cursor:'pointer', textDecoration: 'underline'}} onClick={()=> navigate('/login')}> Login here</p>
        </div>
    );
}
