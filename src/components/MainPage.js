import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Form, Button, Card, InputGroup, FormControl } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import {jwtDecode} from "jwt-decode";

const MainPage = () => {
    const [theme, setTheme] = useState(() => localStorage.getItem('theme') || 'light');
    const [existingUserEmail, setExistingUserEmail] = useState('');
    const [existingUserExternalIdPrefix, setExistingUserExternalIdPrefix] = useState('');
    const [existingUserName, setExistingUserName] = useState('');
    const [existingUserEmailVerified, setExistingUserEmailVerified] = useState(false);
    const [newUserEmail, setNewUserEmail] = useState('');
    const [newUserExternalIdPrefix, setNewUserExternalIdPrefix] = useState('');
    const [newUserName, setNewUserName] = useState('');
    const [newUserEmailVerified, setNewUserEmailVerified] = useState(false);
    const [jwtExpiryMinutes, setJwtExpiryMinutes] = useState('NA');
    const [adminJwtExpiryMinutes, setAdminJwtExpiryMinutes] = useState('NA');
    const [jwtToken, setJwtToken] = useState(null);
    const [decodedJwtToken, setDecodedJwtToken] = useState(null);

    const handleExistingUserLogin = async () => {
        try {
            const response = await fetch('http://localhost:3001/auth', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    userType: "existingUser",
                    existingUserEmail,
                    existingUserName,
                    existingUserExternalIdPrefix,
                    existingUserEmailVerified,
                    jwtExpiryMinutes: jwtExpiryMinutes === 'NA' ? null : Number(jwtExpiryMinutes)
                }),
            });

            const data = await response.json();
            if (data.messageToken) {
                const decodedJwtToken = jwtDecode(data.messageToken);

                sessionStorage.setItem('jwtToken', data.messageToken);
                sessionStorage.setItem('decodedJwtToken', JSON.stringify(decodedJwtToken));
                sessionStorage.setItem('existingUserEmail', existingUserEmail);
                sessionStorage.setItem('existingUserExternalIdPrefix', existingUserExternalIdPrefix);
                sessionStorage.setItem('existingUserName', existingUserName);
                sessionStorage.setItem('existingUserEmailVerified', JSON.stringify(existingUserEmailVerified));
                sessionStorage.setItem('jwtExpiryMinutes', jwtExpiryMinutes);
                sessionStorage.setItem('userType', 'existingUser');

                window.location.href = '/';
            } else {
                console.error('No token returned');
            }
        } catch (error) {
            console.error(error);
        }
    }

    const handleNewUserLogin = async () => {
        try {
            const response = await fetch('http://localhost:3001/auth', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    userType: "newUser",
                    newUserEmail,
                    newUserExternalIdPrefix,
                    newUserName,
                    newUserEmailVerified,
                    jwtExpiryMinutes: jwtExpiryMinutes === 'NA' ? null : Number(jwtExpiryMinutes)
                }),
            });

            const data = await response.json();
            if (data.messageToken) {
                const decodedJwtToken = jwtDecode(data.messageToken);

                sessionStorage.setItem('jwtToken', data.messageToken);
                sessionStorage.setItem('decodedJwtToken', JSON.stringify(decodedJwtToken));
                sessionStorage.setItem('newUserEmail', newUserEmail);
                sessionStorage.setItem('newUserExternalIdPrefix', newUserExternalIdPrefix);
                sessionStorage.setItem('newUserName', newUserName);
                sessionStorage.setItem('newUserEmailVerified', JSON.stringify(newUserEmailVerified));
                sessionStorage.setItem('jwtExpiryMinutes', jwtExpiryMinutes);
                sessionStorage.setItem('userType', 'newUser');

                window.location.href = '/';
            } else {
                console.error('No token returned');
            }
        } catch (error) {
            console.error(error);
        }
    };

    const handleAdminLogin = async () => {
        try {
            const response = await fetch('http://localhost:3001/auth', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    userType: "admin",
                    adminJwtExpiryMinutes: adminJwtExpiryMinutes === 'NA' ? null : Number(adminJwtExpiryMinutes)
                }),
            });

            const data = await response.json();

            if (data.messageToken) {
                const decodedJwtToken = jwtDecode(data.messageToken);

                sessionStorage.setItem('jwtToken', data.messageToken);
                sessionStorage.setItem('decodedJwtToken', JSON.stringify(decodedJwtToken));
                sessionStorage.setItem('adminJwtExpiryMinutes', adminJwtExpiryMinutes);
                sessionStorage.setItem('userType', 'admin');

                window.location.href = '/';
            } else {
                console.error('No token returned');
            }
        } catch (error) {
            console.error(error);
        }
    };

    const handleSSOFromWebpageToHelpCenter = async () => {}

    const fetchJWTToken = async () => {
        let response;
        const userType = sessionStorage.getItem('userType');

        if (userType === 'admin') {
            response = await fetch('http://localhost:3001/auth', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    userType: 'admin',
                    adminJwtExpiryMinutes: adminJwtExpiryMinutes === 'NA' ? null : Number(adminJwtExpiryMinutes)
                })
            })
        } else if (userType === 'newUser') {
            const newUserEmail = sessionStorage.getItem('newUserEmail') || '';
            const newUserExternalIdPrefix = sessionStorage.getItem('newUserExternalIdPrefix') || '';
            const newUserName = sessionStorage.getItem('newUserName') || '';
            const newUserEmailVerified = JSON.parse(sessionStorage.getItem('newUserEmailVerified') || 'false');
            const jwtExpiryMinutesRaw = sessionStorage.getItem('jwtExpiryMinutes') || 'NA';
            const jwtExpiryMinutes = jwtExpiryMinutesRaw === 'NA' ? null : Number(jwtExpiryMinutesRaw);

            response = await fetch('http://localhost:3001/auth', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    userType: 'newUser',
                    newUserEmail,
                    newUserExternalIdPrefix,
                    newUserName,
                    newUserEmailVerified,
                    jwtExpiryMinutes,
                })
            });
        } else if (userType === 'existingUser') {
            const existingUserEmail = sessionStorage.getItem('existingUserEmail') || '';
            const existingUserExternalIdPrefix = sessionStorage.getItem('existingUserExternalIdPrefix') || '';
            const existingUserName = sessionStorage.getItem('existingUserName') || '';
            const existingUserEmailVerified = JSON.parse(sessionStorage.getItem('existingUserEmailVerified') || 'false');

            response = await fetch('http://localhost:3001/auth', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    userType: 'existingUser',
                    existingUserEmail,
                    existingUserExternalIdPrefix,
                    existingUserName,
                    existingUserEmailVerified,
                    jwtExpiryMinutes
                })
            });
        }

        return response.json();
    };

    const handleCopy = () => {
        navigator.clipboard.writeText(jwtToken);
    };

    const handleClearSessionStorage = () => {
        window.zE('messenger', 'logoutUser');
        localStorage.clear();
        sessionStorage.clear();
        setNewUserEmail('');
        setNewUserExternalIdPrefix('');
        setNewUserName('');
        setNewUserEmailVerified(false);
        setJwtExpiryMinutes('NA');
        setAdminJwtExpiryMinutes('NA');
        setJwtToken(null);
        setDecodedJwtToken(null);
    }

    useEffect(() => {
        const storedToken = sessionStorage.getItem('jwtToken');
        const storedDecoded = sessionStorage.getItem('decodedJwtToken');

        if (storedToken) setJwtToken(storedToken);
        if (storedDecoded) setDecodedJwtToken(JSON.parse(storedDecoded));
    }, []);

    useEffect(() => {
        const zendeskScript = document.createElement('script');
        zendeskScript.id = 'ze-snippet';
        zendeskScript.src = 'https://static.zdassets.com/ekr/snippet.js?key=6b8220bb-b66e-4385-bff3-c4185d610542';
        document.body.appendChild(zendeskScript);

        const storedJwtToken  = sessionStorage.getItem('jwtToken');

        if(storedJwtToken) {
            setTimeout(() => {
                window.zE('messenger', 'loginUser', async function jwtCallback(callback) {
                    fetchJWTToken()
                        .then(data => {
                            setJwtToken(data.messageToken);
                            callback(data.messageToken);
                        })
                        .catch(error => console.log("Error: " + error));
                });

                window.zE('messenger:set', 'conversationTags', []);
                window.zE('messenger:set', 'conversationFields', []);
            }, 1000);
        }
    }, []);

    useEffect(() => {
        localStorage.setItem('theme', theme);
    }, [theme]);

    return (
        <div
            style={{
                minHeight: '100vh',
                backgroundColor: theme === 'light' ? '#f8f9fa' : '#121212',
                color: theme === 'light' ? '#000' : '#fff',
                transition: 'background-color 0.3s, color 0.3s',
            }}
        >
            <Container className="pt-5 d-flex flex-column align-items-center">
                <Row className="w-100 justify-content-center" style={{ maxWidth: '1200px' }}>
                    <Col md={12} className="mb-4 d-flex justify-content-end">
                        <Button
                            variant={theme === 'light' ? 'dark' : 'light'}
                            onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')}
                        >
                            Switch to {theme === 'light' ? 'Dark' : 'Light'} Theme
                        </Button>
                    </Col>

                    {/* JWT Token Display */}
                    <Col md={12} className="mb-4">
                        <Card bg={theme === 'light' ? 'info' : 'dark'} text="white" className="p-3">
                            <Card.Title>JWT Token</Card.Title>
                            <InputGroup className="mb-3">
                                <FormControl
                                    value={jwtToken || 'No token generated yet.'}
                                    readOnly
                                    style={{ wordBreak: 'break-all' }}
                                />
                                <Button
                                    variant={theme === 'light' ? 'secondary' : 'light'}
                                    onClick={handleCopy}
                                    disabled={!jwtToken}
                                >
                                    Copy
                                </Button>
                            </InputGroup>

                            {decodedJwtToken && typeof decodedJwtToken === 'object' && (
                                <>
                                    <Card.Title>Decoded JWT Payload:</Card.Title>
                                    <div
                                        style={{
                                            backgroundColor: theme === 'light' ? '#ffffff' : '#333',
                                            color: theme === 'light' ? '#000' : '#fff',
                                            borderRadius: '0.5rem',
                                            padding: '1rem',
                                            fontSize: '0.9rem',
                                        }}
                                    >
                                        {Object.entries(decodedJwtToken).map(([key, value]) => (
                                            <div key={key} style={{ marginBottom: '0.25rem' }}>
                                                <strong>{key}:</strong>{' '}
                                                {typeof value === 'object' ? JSON.stringify(value) : value.toString()}
                                            </div>
                                        ))}
                                    </div>
                                </>
                            )}
                        </Card>
                    </Col>

                    {/* Existing User Login */}
                    <Col md={4} className="mb-4">
                    <Card bg={theme === 'light' ? 'light' : 'dark'} text={theme === 'light' ? 'dark' : 'white'} className="p-4">
                        <Card.Title>Existing User Login</Card.Title>
                        <Card.Text>This is use for existing user credentials login</Card.Text>
                        <Form>
                            <Row>
                                <Col>
                                    <Form.Group className="mb-3" controlId="formEmail">
                                        <Form.Label>Email Address</Form.Label>
                                        <Form.Control
                                            type="text"
                                            value={existingUserEmail}
                                            onChange={(e) => setExistingUserEmail(e.target.value)}
                                        />
                                    </Form.Group>
                                </Col>
                                <Col>
                                    <Form.Group className="mb-3" controlId="formNameA">
                                        <Form.Label>Name</Form.Label>
                                        <Form.Control
                                            type="text"
                                            value={existingUserName}
                                            onChange={(e) => setExistingUserName(e.target.value)}
                                        />
                                    </Form.Group>
                                </Col>
                            </Row>

                            <Form.Group className="mb-3" controlId="formExternalIdA">
                                <Form.Label>External ID Prefix</Form.Label>
                                <Form.Control
                                    type="text"
                                    value={existingUserExternalIdPrefix}
                                    onChange={(e) => setExistingUserExternalIdPrefix(e.target.value)}
                                />
                            </Form.Group>

                            <Row>
                                <Col>
                                    <Form.Group className="mb-3" controlId="formJwtExpiryA">
                                        <Form.Label>JWT Expiry (minutes)</Form.Label>
                                        <Form.Select
                                            value={jwtExpiryMinutes}
                                            onChange={(e) => setJwtExpiryMinutes(e.target.value)}
                                        >
                                            <option value="NA">NA</option>
                                            {Array.from({ length: 60 }, (_, i) => (
                                                <option key={i + 1} value={(i + 1).toString()}>
                                                    {i + 1}
                                                </option>
                                            ))}
                                        </Form.Select>
                                    </Form.Group>
                                </Col>
                                <Col>
                                    <Form.Group className="mb-3" controlId="formEmailVerifiedA">
                                        <Form.Check
                                            type="checkbox"
                                            label="Email Verified?"
                                            checked={existingUserEmailVerified}
                                            onChange={(e) => setExistingUserEmailVerified(e.target.checked)}
                                        />
                                    </Form.Group>
                                </Col>
                            </Row>

                            <Button variant={theme === 'light' ? 'dark' : 'light'} onClick={handleExistingUserLogin} className="float-end">
                                Login
                            </Button>
                        </Form>
                    </Card>
                    </Col>

                    {/* New User Login */}
                    <Col md={4} className="mb-4">
                        <Card bg={theme === 'light' ? 'light' : 'dark'} text={theme === 'light' ? 'dark' : 'white'} className="p-4">
                            <Card.Title>New User Login</Card.Title>
                            <Card.Text>This will create a new user and login</Card.Text>
                            <Form>
                                <Row>
                                    <Col>
                                        <Form.Group className="mb-3" controlId="formEmailA">
                                            <Form.Label>Email Address</Form.Label>
                                            <Form.Control
                                                type="text"
                                                value={newUserEmail}
                                                onChange={(e) => setNewUserEmail(e.target.value)}
                                            />
                                        </Form.Group>
                                    </Col>
                                    <Col>
                                        <Form.Group className="mb-3" controlId="formNameA">
                                            <Form.Label>Name</Form.Label>
                                            <Form.Control
                                                type="text"
                                                value={newUserName}
                                                onChange={(e) => setNewUserName(e.target.value)}
                                            />
                                        </Form.Group>
                                    </Col>
                                </Row>

                                <Form.Group className="mb-3" controlId="formExternalIdA">
                                    <Form.Label>External ID Prefix</Form.Label>
                                    <Form.Control
                                        type="text"
                                        value={newUserExternalIdPrefix}
                                        onChange={(e) => setNewUserExternalIdPrefix(e.target.value)}
                                    />
                                </Form.Group>

                                <Row>
                                    <Col>
                                        <Form.Group className="mb-3" controlId="formJwtExpiryA">
                                            <Form.Label>JWT Expiry (minutes)</Form.Label>
                                            <Form.Select
                                                value={jwtExpiryMinutes}
                                                onChange={(e) => setJwtExpiryMinutes(e.target.value)}
                                            >
                                                <option value="NA">NA</option>
                                                {Array.from({ length: 60 }, (_, i) => (
                                                    <option key={i + 1} value={(i + 1).toString()}>
                                                        {i + 1}
                                                    </option>
                                                ))}
                                            </Form.Select>
                                        </Form.Group>
                                    </Col>
                                    <Col className="d-flex align-items-end">
                                        <Form.Group className="mb-3" controlId="formEmailVerifiedA">
                                            <Form.Check
                                                type="checkbox"
                                                label="Email Verified?"
                                                checked={newUserEmailVerified}
                                                onChange={(e) => setNewUserEmailVerified(e.target.checked)}
                                            />
                                        </Form.Group>
                                    </Col>
                                </Row>

                                <Button variant={theme === 'light' ? 'dark' : 'light'} onClick={handleNewUserLogin} className="float-end">
                                    Login
                                </Button>
                            </Form>
                        </Card>
                    </Col>

                    {/* Admin Login */}
                    <Col md={4} className="mb-4">
                        <Card bg={theme === 'light' ? 'dark' : 'secondary'} text="white" className="p-4">
                            <Card.Title>Admin Login</Card.Title>
                            <Card.Text>This is for admin credential login</Card.Text>
                            <Form>
                                <Row>
                                    <Col>
                                        <Form.Group className="mb-3" controlId="formEmailB">
                                            <Form.Label>Email Address</Form.Label>
                                            <Form.Control type="text" value="admin@email.com" readOnly />
                                        </Form.Group>
                                    </Col>
                                    <Col>
                                        <Form.Group className="mb-3" controlId="formNameB">
                                            <Form.Label>Name</Form.Label>
                                            <Form.Control type="text" value="Administrator" readOnly />
                                        </Form.Group>
                                    </Col>
                                </Row>

                                <Form.Group className="mb-3" controlId="formExternalIdB">
                                    <Form.Label>External ID</Form.Label>
                                    <Form.Control
                                        type="text"
                                        value="admin-01976f0f-1ab5-7d63-b123-8e84e9637b5f"
                                        readOnly
                                    />
                                </Form.Group>

                                <Row>
                                    <Col>
                                        <Form.Group className="mb-3" controlId="formJwtExpiryB">
                                            <Form.Label>JWT Expiry (minutes)</Form.Label>
                                            <Form.Select
                                                value={adminJwtExpiryMinutes}
                                                onChange={(e) => setAdminJwtExpiryMinutes(e.target.value)}
                                            >
                                                <option value="NA">NA</option>
                                                {Array.from({ length: 60 }, (_, i) => (
                                                    <option key={i + 1} value={(i + 1).toString()}>
                                                        {i + 1}
                                                    </option>
                                                ))}
                                            </Form.Select>
                                        </Form.Group>
                                    </Col>
                                    <Col className="d-flex align-items-end">
                                        <Form.Group className="mb-3" controlId="formEmailVerifiedB">
                                            <Form.Check
                                                type="checkbox"
                                                label="Email Verified?"
                                                checked={true}
                                                readOnly
                                            />
                                        </Form.Group>
                                    </Col>
                                </Row>

                                <Button variant={theme === 'light' ? 'light' : 'dark'} onClick={handleAdminLogin} className="float-end">
                                    Login
                                </Button>
                            </Form>
                        </Card>
                    </Col>

                    {/* Others */}
                    <Col md={12} className="mb-4">
                        <Card
                            style={{
                                backgroundColor: theme === 'light' ? '#ffffff' : '#1c1c1c',
                                color: theme === 'light' ? '#000' : '#fff',
                            }}
                            className="p-3"
                        >
                            <Card.Title>Others</Card.Title>
                            <Button variant="primary" onClick={handleSSOFromWebpageToHelpCenter} disabled={!jwtToken}>
                                SSO From WebPage to Help Center
                            </Button>
                        </Card>
                    </Col>

                    {/* Utilities */}
                    <Col md={12} className="mb-4">
                        <Card
                            style={{
                                backgroundColor: theme === 'light' ? '#ffffff' : '#1c1c1c',
                                color: theme === 'light' ? '#000' : '#fff',
                            }}
                            className="p-3"
                        >
                            <Card.Title>Utilities</Card.Title>
                            <Button variant="danger" onClick={handleClearSessionStorage} disabled={!jwtToken}>
                                Clear Session Storage
                            </Button>
                        </Card>
                    </Col>

                </Row>
            </Container>
        </div>
    );
};

export default MainPage;
