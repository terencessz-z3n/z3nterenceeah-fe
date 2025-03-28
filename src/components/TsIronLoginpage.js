import React, { useState, useEffect } from 'react';
import '../App.css';
import { useNavigate } from 'react-router-dom';

const TsCapLoginPage = () => {
    const navigate = useNavigate();

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        if (name === 'email') {
            setEmail(value);
        } else if (name === 'password') {
            setPassword(value);
        }
    };

    const handleLogin = async (e) => {
        e.preventDefault();

        try {
            const response = await fetch('http://localhost:3001/auth/multibrandauth', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    email,
                    password
                })
            });

            if (response.status === 201) {
                const redirectURL = await response.text();
                window.location.href = redirectURL
            } else {
                alert("Invalid Login Credentials");
            }
        } catch (error) {
            console.log(error)
        }
    };

    return (
        <div>
            <div className="login-container">
                <div className="form-container">
                    <h1>Welcome to TSIRON</h1>
                    <form onSubmit={handleLogin}>
                        <input
                            type="text"
                            name="email"
                            placeholder="Username"
                            value={email}
                            onChange={handleInputChange}
                        />
                        <input
                            type="password"
                            name="password"
                            placeholder="Password"
                            value={password}
                            onChange={handleInputChange}
                        />
                        <button type="submit">Submit</button>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default TsCapLoginPage;