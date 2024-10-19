import React, { useState } from 'react';
import Login from './Login';
import Signup from './Signup';


import './Startup.css';

const Startup = ({user, setUser, onLogin}) => {

    const [isSigningUp, setIsSigningUp] = useState(false); // State to toggle between Login and Signup

    const toggleAuthMode = () => {
        setIsSigningUp((prevState) => !prevState); // Toggle between Login and Signup
    };

    return (
        <div>
            <div className="main-container">
                <div className="auth-container">
                    {isSigningUp ? (
                        <Signup setUser={setUser} onLogin={onLogin}/>
                    ) : (
                        <Login setUser={setUser} onLogin={onLogin}/>
                    )}
                    <button className={"swap-button"} onClick={toggleAuthMode}>
                        <span className={'swap-text'}>{isSigningUp ? "Already have an account? Login" : "Need an account? Sign up"}</span>
                    </button>
                </div>
            </div>

        </div>
    )};



export default Startup;