import { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';

const brandURLs = {
    "31206918343705": "https://z3ntscap.zendesk.com",
    "41805237569433": "https://z3ntsiron.zendesk.com",
};

const LoginPage = () => {
    const location = useLocation();

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [brandId, setBrandId] = useState('');

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
                const token = await response.text();

                for (const [key, value] of Object.entries(brandURLs)) {
                    if (key === brandId) {
                        window.location.href = "https://z3ntscap.zendesk.com/access/jwt?jwt=" + token + "&return_to=" + encodeURIComponent(value + "/hc/en-us");
                    }
                }
            } else {
                alert("Invalid Login Credentials");
            }
        } catch (error) {
            console.log(error)
        }
    };

    useEffect(() => {
        const params = new URLSearchParams(location.search);
        const brandId = params.get('brand_id');
        setBrandId(brandId);

        console.log(brandId)
    }, [location]);

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
}

export default LoginPage;