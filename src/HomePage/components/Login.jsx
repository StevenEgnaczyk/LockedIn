import React, { useState } from 'react';
import {Input} from "@nextui-org/input";
import {auth} from '../../index';
import {toast} from 'react-toastify';

import './Startup.css';
import { signInWithEmailAndPassword } from 'firebase/auth';

const Login = ({onLogin}) => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');


    const handleLogin = async (e) => {
        e.preventDefault();
        try {
            await signInWithEmailAndPassword(auth, email, password);
            toast.success("Logged in successfully");
            onLogin();
        } catch (error) {
            console.error("Error signing in:", error);
            toast.error("Failed to log in. Please check your credentials.");
        }
    }

    return (
        <div className="auth-container">
            <h2 className={'header-text'}>Login</h2>
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
                <div className={'button'} onClick={handleLogin}>
                    <span className={'text'} >Login</span>
                </div>
            </form>
        </div>
    )
}

export default Login;