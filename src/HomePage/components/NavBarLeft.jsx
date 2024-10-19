import React, {useState} from "react";

import {Button} from "@nextui-org/react";
import { BsChevronDoubleRight, BsChevronDoubleLeft } from "react-icons/bs";

import './NavBarLeft.css'
import ProfileRow from "./ProfileRow";

const NavBarLeft = () => {

    const [isOpen, setOpen] = useState(false);
    const [resultCount, setResultCount] = useState(10); // Default to 10 results
    const [profileOpen, setProfileOpen] = useState('false');
    const maxResults = 25; // Maximum results

    const openNavbar = () => {
        setOpen(!isOpen);
    }

    const handleResultCountChange = (e) => {
        const value = e.target.value; // Get the input value as a string
        if (value === "") {
            setResultCount(0); // Set to 0 if input is blank
        } else {
            const numberValue = Math.min(maxResults, Math.max(0, Number(value))); // Ensure value is between 0 and maxResults
            setResultCount(numberValue);
        }
    }

    const openProfile = () => {
        setProfileOpen(!isOpen);
    }

    // Sample data for demonstration (replace with actual data)
    const profileRows = Array.from({ length: 20 }, (_, index) => (
        <ProfileRow key={index} onClick={openProfile}/>
    ));

    return (
        <div className={"navbar-container"}>
            {isOpen ? (
                <Button className={"popout-button"} isIconOnly color="danger" aria-label="Like" disableRipple={true}>
                    <BsChevronDoubleRight className={'icon'} onClick={openNavbar}/>
                </Button>
            ) : (
                <div className={"open-navbar"}>
                    {profileOpen ? (
                        <div>
                            <div className={'top-row'}>
                                <form className={"search-bar"}>
                                    <input
                                        type="text"
                                        placeholder="Search..." // Added placeholder
                                        onFocus={(e) => e.target.placeholder = ''} // Clear placeholder on focus
                                        onBlur={(e) => e.target.placeholder = 'Search...'} // Restore placeholder on blur
                                    />
                                    <button type="button"  className={"search-button"}>🔍</button>
                                </form>
                                <div className={"popout-button"}>
                                    <BsChevronDoubleLeft className={'icon'} onClick={openNavbar}/>
                                </div>
                            </div>
                            <div className={'result-count'}>
                                <label htmlFor="resultCount">Results:</label>
                                <input
                                    className={'counter'}
                                    type="number"
                                    id="resultCount"
                                    value={resultCount === 0 ? "" : resultCount}
                                    min="0"
                                    max={maxResults}
                                    onChange={handleResultCountChange}
                                />
                            </div>
                            <div className={'search-content'}>
                                {profileRows.slice(0, resultCount)} {/* Display only the selected number of ProfileRow components */}
                            </div>
                        </div>
                    ) : (
                        <div>
                            <div className={"popout-button"}>
                                <BsChevronDoubleLeft className={'icon'} onClick={openProfile}/>
                            </div>
                        </div>
                    )}

                </div>
            )};

        </div>
    );
}
export default NavBarLeft;