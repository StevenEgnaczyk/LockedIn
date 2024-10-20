import React, {useRef, useState} from "react";
import './NavBarRight.css';
import { CiSettings } from "react-icons/ci";
import { BsFileEarmark } from "react-icons/bs";
import { BsFunnel } from "react-icons/bs";
import UserMerge from "./UserMerge";
import FileUpload from "./FileUpload";

const NavBarRight = () => {
    const [isOpen, setOpen] = useState(false);
    const [fullBarPage, setFullBarPage] = useState(null); // Manage the active page

    const toggleNavbar = () => {
        if (isOpen) {
            setFullBarPage(null);
        }
        setOpen(!isOpen);
    }

    const setBarPage = (page) => {
        setFullBarPage(page); // Set the active page based on button click
    };

    return (
        <div className="navbar-right-container">
            {fullBarPage && (
                <div className="full-bar">
                    {/* Render content based on the active page */}
                    {fullBarPage === 'home' && <div>Home Content</div>}
                    {fullBarPage === 'filter' && <UserMerge />}
                    {fullBarPage === 'file-upload' && <FileUpload />}
                </div>
            )}
            <div className="navbar-dropdown">
            <div className="popout-button-right" onClick={toggleNavbar}>
                <CiSettings className="icon-right" />
            </div>
            {isOpen && (
                <div className={'opened-buttons'}>
                    <div className="home-button" onClick={() => setBarPage('home')}>
                        <BsFileEarmark className="icon" />
                    </div>
                    <div className="filter-button" onClick={() => setBarPage('filter')}>
                        <BsFunnel className="icon" />
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