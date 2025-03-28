import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import '../App.css';

const TsCapLoginPage = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [returnTo, setReturnTo] = useState('');
    const location = useLocation();

    useEffect(() => {
        const params = new URLSearchParams(location.search);
        const returnToParam = params.get('return_to')
        if (returnToParam) {
            setReturnTo(returnToParam);
        }
    }, [location]);

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
                    password,
                    return_to: returnTo
                })
            });

            if (response.status === 201) {
                const redirectURL = await response.text();
                window.location.href = redirectURL;
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
                    <h1>Welcome</h1>
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