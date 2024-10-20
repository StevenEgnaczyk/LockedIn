import React, {useRef, useState} from "react";
import { Button } from "@nextui-org/react";
import UploadBar from "./UploadBar"; 
import './NavBarRight.css'; 
import { CiSettings } from "react-icons/ci";
import { BsFileEarmark } from "react-icons/bs";

const NavBarRight = () => {
    const [isOpen, setOpen] = useState(false);
    const [fullBarPage, setFullBarPage] = useState(null); // Manage the active page

    const toggleNavbar = () => setOpen(!isOpen);

    const setBarPage = (page) => {
        setFullBarPage(page); // Set the active page based on button click
    };

    return (
        <div className="navbar-right-container">
            {fullBarPage && (
                <div className="full-bar">
                    {/* Render content based on the active page */}
                    {fullBarPage === 'home' && <div>Home Content</div>}
                    {fullBarPage === 'filter' && <div>Filter Content</div>}
                    {fullBarPage === 'file-upload' && <UploadBar />}
                </div>
            )}
            <div className="navbar-dropdown">
            <div className="popout-button-right" onClick={toggleNavbar}>
                <CiSettings className="icon-right" />
            </div>
            {isOpen && (
                <div>
                    <div className="home-button" onClick={() => setBarPage('home')}>
                        <BsFileEarmark className="icon" />
                    </div>
                    <div className="filter-button" onClick={() => setBarPage('filter')}>
                        <BsFileEarmark className="icon" />
                    </div>
                    <div className="file-upload-button" onClick={() => setBarPage('file-upload')}>
                        <BsFileEarmark className="icon" />
                    </div>
                </div>
            )}
            </div>
        </div>
    );
};

export default NavBarRight;