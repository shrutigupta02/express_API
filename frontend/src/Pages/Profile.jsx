import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

function Profile() {
    const [user, setUser] = useState(null);
    const [message, setMessage] = useState('');
    const [updateData, setUpdateData] = useState({
        firstName: '',
        lastName: '',
        email: '',
        number: ''
    });
    const [passwords, setPasswords] = useState({
        oldPassword: '',
        newPassword: ''
    });
    const navigate = useNavigate();

    // Fetch user profile data when component mounts
    useEffect(() => {
        // Fetch user profile with session cookie
        fetch('http://localhost:1234/user/profile', {
            credentials: 'include',  // Ensure the session cookie is sent with the request
        })
            .then((res) => {
                if (!res.ok) {
                    throw new Error('Failed to fetch profile');
                }
                return res.json();
            })
            .then((data) => {
                setUser(data);  // If successful, set user data in state
            })
            .catch((err) => {
                console.error(err);
                setMessage('Error loading profile');
                navigate('/login');  // Redirect to login if not authenticated
            });
    }, [navigate]);
    
    

    // Handle profile update
    const handleUpdateProfile = async () => {
        const response = await fetch('http://localhost:1234/user/profile', {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            credentials: 'include',
            body: JSON.stringify(updateData),
        });

        const data = await response.json();
        setMessage(data.message);
        if (data.success) {
            // Optionally, you can update the user state here
            setUser({ ...user, ...updateData });
        }
    };

    // Handle password change
    const handleChangePassword = async () => {
        const response = await fetch('http://localhost:1234/user/change-password', {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            credentials: 'include',
            body: JSON.stringify(passwords),
        });

        const data = await response.json();
        setMessage(data.message);
    };

    return (
        <div>
            <h2>User Profile</h2>
            {user ? (
                <div>
                    <p>First Name: {user.firstName}</p>
                    <p>Last Name: {user.lastName}</p>
                    <p>Email: {user.email}</p>
                    <p>Phone Number: {user.number}</p>
                    
                    <h3>Update Profile</h3>
                    <input 
                        type="text" 
                        placeholder="First Name" 
                        value={updateData.firstName} 
                        onChange={(e) => setUpdateData({ ...updateData, firstName: e.target.value })} 
                    />
                    <input 
                        type="text" 
                        placeholder="Last Name" 
                        value={updateData.lastName} 
                        onChange={(e) => setUpdateData({ ...updateData, lastName: e.target.value })} 
                    />
                    <input 
                        type="email" 
                        placeholder="Email" 
                        value={updateData.email} 
                        onChange={(e) => setUpdateData({ ...updateData, email: e.target.value })} 
                    />
                    <input 
                        type="text" 
                        placeholder="Phone Number" 
                        value={updateData.number} 
                        onChange={(e) => setUpdateData({ ...updateData, number: e.target.value })} 
                    />
                    <button onClick={handleUpdateProfile}>Update Profile</button>

                    <h3>Change Password</h3>
                    <input 
                        type="password" 
                        placeholder="Old Password" 
                        value={passwords.oldPassword} 
                        onChange={(e) => setPasswords({ ...passwords, oldPassword: e.target.value })} 
                    />
                    <input 
                        type="password" 
                        placeholder="New Password" 
                        value={passwords.newPassword} 
                        onChange={(e) => setPasswords({ ...passwords, newPassword: e.target.value })} 
                    />
                    <button onClick={handleChangePassword}>Change Password</button>
                </div>
            ) : (
                <p>{message}</p>
            )}
        </div>
    );
}

export default Profile;
