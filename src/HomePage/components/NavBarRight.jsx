import React, {useRef, useState} from "react";
import './NavBarRight.css';
import { CiSettings } from "react-icons/ci";

import { BsFileEarmark, BsPower} from "react-icons/bs";
import { BsFunnel } from "react-icons/bs";
import UserMerge from "./UserMerge";
import FileUpload from "./FileUpload";

const NavBarRight = ({setLogOut}) => {
    const [isOpen, setOpen] = useState(false);
    const [fullBarPage, setFullBarPage] = useState(null);

    const toggleNavbar = () => {
        if (isOpen) {
            setFullBarPage(null);
        }
        setOpen(!isOpen);
    }

    const setBarPage = (page) => {
        setFullBarPage(page);
    };

    return (
        <div className="navbar-right-container">
            {fullBarPage && (
                <div className="full-bar">
                    {fullBarPage === 'Log Out' && <button  onClick={setLogOut}>Confirm Logout?</button> }
                    {fullBarPage === 'filter' && <UserMerge />}
                    {fullBarPage === 'file-upload' && <FileUpload />}
                </div>
            )}
            <div className="navbar-dropdown">
            <div className="popout-button-right" onClick={toggleNavbar}>
                <CiSettings className="icon-right" />
            </div>
            {isOpen && (
                <div>
                    <div className="Logout-button" onClick={() => setBarPage('Log Out')}>
                        <BsPower className="icon" />
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