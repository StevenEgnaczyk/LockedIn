import React, { useState } from 'react';
import { Button, ButtonGroup } from "@nextui-org/react";
import {Input} from "@nextui-org/input";

import './Startup.css';

const Login = ({ onLogin }) => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');


    const handleLoginClick = (e) => {
        e.preventDefault();
        onLogin();
    }
    
    return (
        <div className="auth-container">
            <h2>Login</h2>
            <form className="login-form">
                <Input
                    type="email"
                    placeholder="Email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}/>
                <Input
                    type="password"
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}/>
                <div className={'button'} onClick={handleLoginClick}>
                <span className={'text'}>Login</span>
                </div>
            </form>
        </div>
    );
}

export default Login;