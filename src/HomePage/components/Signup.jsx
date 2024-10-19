import React, { useState } from 'react';
import { Button, ButtonGroup } from "@nextui-org/react";
import { Input } from "@nextui-org/input";
import { toast } from 'react-toastify';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { auth, firestore } from '../../index';

import './Startup.css';
import firebase from 'firebase/compat/app';

const Signup = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSignup = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            const userCredential = await createUserWithEmailAndPassword(auth, email, password);

            /* Send email verification */
            await userCredential.user.sendEmailVerification(userCredential.user);

            /* Pop up with success and verification notice */
            toast.success("A verification email has been sent to your email address", { position: 'top-center' });
            setEmail('');
            setPassword('');

        } catch (err) {
            let error_message;
            switch (err.code) {
                case 'auth/email-already-in-use':
                    error_message = "The email address is already in use by another account.";
                    break;
                case 'auth/invalid-email':
                    error_message = "The email address is not valid.";
                    break;
                case 'auth/weak-password':
                    error_message = "The password must contain a minimum of 6 characters";
                    break;
                default:
                    error_message = err.message;
            }
            toast.error(error_message, { position: 'top-center' });
            await new Promise(resolve => setTimeout(resolve, 5000)); // Wait for 5 seconds
        } finally {
            setLoading(false);
        }
    }

    return (
        <div className="auth-container">
            <h2>Signup</h2>
            <form className="login-form">
                <Input
                    type="email"
                    placeholder="Email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)} />
                <Input
                    type="password"
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)} />
                <div className={'button'}>
                    <span className={'text'} onClick={handleSignup}>Signup</span>
                </div>
            </form>
        </div>
    )
}

export default Signup;
