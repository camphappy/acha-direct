import React, { useState } from 'react';

const LogonFrm = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');

    const handleLogin = (e) => {
        e.preventDefault();
        // Placeholder logic for login (you can add actual logic here)
        console.log('Logging in:', username, password);
    };

    return (
        <div className="logon-container">
            <form onSubmit={handleLogin} className="logon-form">
                <img src="/pics/logo.webp"
                     alt="Acha Direct Logo"
                     className = "logo"
                />
                
                <label htmlFor="username">Username:</label>
                <input
                    type="text"
                    id="username"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    required
                />

                <label htmlFor="password">Password:</label>
                <input
                    type="password"
                    id="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                />

                <button type="submit" className="logon-button">Login to CAPIS</button>
            </form>
        </div>
    );
};

export default LogonFrm;