import React, { useState } from "react";
import { Button } from "@nextui-org/react";
import UploadBar from "./UploadBar"; 
import './NavBarRight.css'; 
import { CiSettings } from "react-icons/ci";

const NavBarRight = () => {
    const [isOpen, setOpen] = useState(false);
    const [showUploadBar, setShowUploadBar] = useState(true); // Default to true to show the UploadBar

    const toggleNavbar = () => setOpen(!isOpen);

    return (
        <div className="navbar-right-container">
            <Button className="popout-button" isIconOnly color="danger" aria-label={isOpen ? "Close" : "Open"} onClick={toggleNavbar} disableRipple>
                <CiSettings className="icon" />
            </Button>

            {isOpen && (
                <div className="open-navbar">
                    {showUploadBar && <UploadBar />}
                </div>
            )}
        </div>
    );
};

export default NavBarRight;
