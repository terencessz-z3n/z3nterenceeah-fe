import React, { useEffect, useState } from 'react';
import Smooch from 'smooch';
import { jwtDecode } from 'jwt-decode';

const MainPage = () => {
    // Define states
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [isFormValid, setIsFormValid] = useState(false);
    const [locale, setLocale] = useState(null);
    const [showMessagingWidgetConversationField, setShowMessagingWidgetConversationalField] = useState(false);
    const [messagingWidgetConversationFields, setMessagingWidgetConversationalField] = useState('');
    const [messageTokenExists, setMessageTokenExists] = useState(false);
    const [suncoTokenExists, setSuncoTokenExists] = useState(false);

    // Messaging Widget functions 
    const handleMessagingWidgetAction = async (action) => {
        window.zE('messenger', action);
    }

    const handleMessagingWidgetLogout = () => {
        window.zE('messenger', 'logoutUser');
        sessionStorage.removeItem('messageToken');
        setMessageTokenExists(false);
    }

    const handleMessagingWidgetLocale = (locale) => {
        window.zE('messenger:set', 'locale', locale);
    };

    const handleMessagingWidgetConversationalFields = () => {
        window.zE('messenger:set', 'conversationFields', [
            { id: '32542768289945', value: 'This is a set conversation field test' }
        ]);
        setShowMessagingWidgetConversationalField(true);
        setMessagingWidgetConversationalField(`window.zE('messenger:set', 'conversationFields', [{ id: '32542768289945', value: 'This is a set conversation field test' }])`);
    };

    const handleLocaleChange = (event) => {
        setLocale(event.target.value);
        handleMessagingWidgetLocale(event.target.value);
    };

    // Sunco Widget functions 
    const handleSuncoWidgetAction = (action) => {
        switch (action) {
            case "open":
                Smooch.open();
                break;
            case "close":
                Smooch.close();
                break;
        }
    }

    const handleSuncoWidgetLogout = () => {
        Smooch.logout();
        sessionStorage.removeItem('suncoToken');
        setSuncoTokenExists(false);
    }

    // Utilities functions
    const handleClearBrowserStorage = () => {
        window.zE('messenger', 'logoutUser');
        Smooch.logout();
        Smooch.destroy();
        localStorage.clear();
        sessionStorage.clear();
        window.location.reload();
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;

        if (name === 'email') {
            setEmail(value);
        } else if (name === 'password') {
            setPassword(value);
        }

        const isValid = email.trim() !== '' && password.trim() !== '';
        setIsFormValid(isValid);
    };

    const handleLogin = async (e) => {
        e.preventDefault();

        try {
            const response = await fetch('http://localhost:3001/auth', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    email,
                    password
                })
            });

            const data = await response.json();

            sessionStorage.setItem('messageToken', data.messageToken);
            sessionStorage.setItem('suncoToken', data.suncoToken);
            sessionStorage.setItem('messageTokenExists', !!data.messageToken);
            sessionStorage.setItem('suncoTokenExists', !!data.suncoToken);
            sessionStorage.setItem('email', email);
            sessionStorage.setItem('password', password);

            setMessageTokenExists(!!data.messageToken);
            setSuncoTokenExists(!!data.suncoToken);

            window.location.href = '/';
        } catch (error) {
            console.log(error);
        }
    };

    const handleAccessGuide = async () => {
        const messageToken = sessionStorage.getItem('messageToken');

        try {
            const response = await fetch(`http://localhost:3001/auth/jwtsso?return_to=https://z3ntscap.tstechlab.com/hc/en-us`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ "messageToken": messageToken })
            });

            if (response.ok) {
                const data = await response.json();
                console.log(data)
                window.location.href = data.redirectURL;
            } else {
                console.error('Failed to get redirect URL');
            }
        } catch (error) {
            console.error(error);
        }
    };

    const fetchJWTToken = async () => {
        const email = sessionStorage.getItem('email');
        const password = sessionStorage.getItem('password');

        const response = await fetch('http://localhost:3001/auth', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                email,
                password
            })
        });

        return response.json();
    };

    useEffect(() => {
        // Adding jQuery script
        const jqueryScript = document.createElement('script');
        jqueryScript.src = 'https://code.jquery.com/jquery-3.3.1.js';
        jqueryScript.integrity = 'sha256-2Kok7MbOyxpgUVvAk/HJ2jigOSYS2auK4Pfzbm7uH60=';
        jqueryScript.crossOrigin = 'anonymous';
        document.body.appendChild(jqueryScript);

        // Adding Bootstrap CSS
        const bootstrapLink = document.createElement('link');
        bootstrapLink.rel = 'stylesheet';
        bootstrapLink.href = 'https://maxcdn.bootstrapcdn.com/bootstrap/4.5.2/css/bootstrap.min.css';
        document.head.appendChild(bootstrapLink);

        // Adding Zendesk Web Widget script
        const zendeskScript = document.createElement('script');
        zendeskScript.id = 'ze-snippet';
        zendeskScript.src = 'https://static.zdassets.com/ekr/snippet.js?key=6b8220bb-b66e-4385-bff3-c4185d610542';
        document.body.appendChild(zendeskScript);


        // Adding Smooch initialization
        Smooch.init({
            integrationId: '66a7bade5a4522eaeddeacfa',
            businessName: 'Sunco Bot',
            businessIconUrl: 'https://z3ntscap.zendesk.com/hc/theming_assets/01JENNYVQQ12T10F4FCJGDA8MZ'
        });

        setTimeout(() => {
            const messageToken = sessionStorage.getItem('messageToken');
            const suncoToken = sessionStorage.getItem('suncoToken');
            const messageTokenExists = sessionStorage.getItem('messageTokenExists') === 'true';
            const suncoTokenExists = sessionStorage.getItem('suncoTokenExists') === 'true';


            setMessageTokenExists(messageTokenExists);
            setSuncoTokenExists(suncoTokenExists);

            window.zE('messenger', 'loginUser', async function jwtCallback(callback) {
                fetchJWTToken()
                    .then(data => {
                        const messageToken = data.messageToken;
                        console.log("Message Token: " + messageToken);
                        callback(messageToken);
                    })
                    .catch(error => {
                        console.log("Error: " + error);
                    });
            }, function loginCallback(error) {
                if (error) {
                    const { type, reason, message } = error
                    console.error(`Error logging in: ${type} - ${reason} - ${message}`)
                }
            });

            window.zE('messenger:set', 'conversationTags', [
            ]);

            window.zE('messenger:set', 'conversationFields', [
            ]);

            if (suncoToken) {
                const decodedSuncoToken = jwtDecode(suncoToken);
                const external_id = decodedSuncoToken.external_id;

                Smooch.login(external_id, suncoToken);
            }
        }, 1000);
    }, []);

    return (
        <>
            <header className='header'><h1>Dashboard</h1></header>
            <div className='container'>
                <h2 className='title'>Login</h2>
                <div className='group'>
                    <form onSubmit={handleLogin}>
                        <input type='text' name='email' placeholder='Username' value={email} onChange={handleInputChange} className='input-field' />
                        <input type='password' name='password' placeholder='Password' value={password} onChange={handleInputChange} className='input-field' />
                        <button type='submit' disabled={!isFormValid} className='primarybutton'>{isFormValid ? 'Login' : 'Please fill in credentials to login'}</button>
                    </form>
                </div>
                <div className='group'>
                    <div><label><b>Sunco Token Exists?</b>{suncoTokenExists ? ' True' : ' False'}</label></div>
                </div>
                <div className='group'>
                    <div><label><b>Message Token Exists?</b> {messageTokenExists ? ' True' : ' False'}</label></div>
                </div>
            </div>
            <div className='container'>
                <h2 className='title'>Sunco Web Widget</h2>
                <div className='group'>
                    <button className='primarybutton' onClick={() => handleSuncoWidgetAction('open')}>Open</button>
                    <button className='primarybutton' onClick={() => handleSuncoWidgetAction('close')}>Close</button>
                    <button className='secondarybutton' onClick={() => handleSuncoWidgetLogout()}>Logout</button>
                </div>
            </div>
            <div className='container'>
                <h2 className='title'>Zendesk Web Widget</h2>
                <div className='group'>
                    <button className='primarybutton' onClick={() => handleMessagingWidgetAction('open')}>Open</button>
                    <button className='primarybutton' onClick={() => handleMessagingWidgetAction('close')}>Close</button>
                    <button className='primarybutton' onClick={() => handleMessagingWidgetAction('show')}>Show</button>
                    <button className='primarybutton' onClick={() => handleMessagingWidgetAction('hide')}>Hide</button>
                    <button className='secondarybutton' onClick={() => handleMessagingWidgetLogout()}>Logout</button>
                </div>
                <div className='group'>
                    <button className='primarybutton' onClick={() => handleMessagingWidgetLocale(locale)}>Set Locale</button>
                    <select className='dropdown rounded-dropdown' value={locale} onChange={handleLocaleChange}>
                        <option value="en-US">en-US</option>
                        <option value="fr">fr</option>
                        <option value="ko">ko</option>
                        <option value="de">de</option>
                        <option value="es">es</option>
                        <option value="vi">vi</option>
                    </select>
                </div>
                <div className='group'>
                    <button className='primarybutton' onClick={() => handleMessagingWidgetConversationalFields(locale)}>Set Conversational Fields</button>
                </div>
                <div className='group'>
                    <label>{showMessagingWidgetConversationField && messagingWidgetConversationFields}</label>
                </div>
            </div>
            <div className='container'>
                <h2 className='title'>SSO to Guide</h2>
                <div className='button-group'>
                    <button className='primarybutton' onClick={handleAccessGuide}>Access Guide</button>
                </div>
            </div>
            <div className='container'>
                <h2 className='title'>Utilities</h2>
                <div className='button-group'>
                    <button className='primarybutton' onClick={handleClearBrowserStorage}>Clear Browser Storage</button>
                </div>
            </div>
        </>
    );
}

export default MainPage;