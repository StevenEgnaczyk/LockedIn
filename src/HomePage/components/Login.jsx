import React, { useState } from 'react';
import { Button, ButtonGroup } from "@nextui-org/react";
import {Input} from "@nextui-org/input";

import './Login.css';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    return (
        <div className="auth-container">
            <h2>Login</h2>
            <form className="login-form">
                <div className="input-container">
                    <Input type="email" placeholder="Email"/>
                    <Input type="password" placeholder="Password"/>
                </div>
                <Button color="primary">
                    Login
                </Button>
            </form>
        </div>
    )
}

export default Login;