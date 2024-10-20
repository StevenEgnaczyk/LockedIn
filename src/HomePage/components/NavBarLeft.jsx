import React, { useState } from "react";
import { Button } from "@nextui-org/react";
import { BsChevronDoubleRight, BsChevronDoubleLeft } from "react-icons/bs";
import { useGraphData } from './GraphDataContext';  // Import your GraphDataContext
import './NavBarLeft.css';
import ProfileRow from "./ProfileRow";
import ProfilePanel from "./ProfilePanel";

const NavBarLeft = () => {
    const { graphData } = useGraphData();  // Get graphData from context
    const [isOpen, setOpen] = useState(false);
    const [resultCount, setResultCount] = useState(1000); // Default to 10 results
    const [profileOpen, setProfileOpen] = useState(false);
    const maxResults = 25; // Maximum results

    const [openNode, setOpenNode] = useState(null);

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

    const openProfile = (node) => {
        setProfileOpen(true);
        setOpenNode(node);
    }

    const closeProfile = () => {
        setProfileOpen(false);
        setOpenNode(null);
    }

    // Prepare profileRows based on graphData if available
    const profileRows = graphData?.nodes?.slice(0, resultCount).map((node, index) => (
        <ProfileRow key={index} openProfile= {() => openProfile(node)} name={node.name} company={node.company} position={node.position} />
    )) || [];  // Ensure profileRows is always defined as an array

    return (
        <div className={"navbar-container"}>
            {isOpen ? (
                <Button className={"popout-button"} isIconOnly color="danger" aria-label="Like" disableRipple={true}>
                    <BsChevronDoubleRight className={'icon'} onClick={openNavbar}/>
                </Button>
            ) : (
                <div className={"open-navbar-left"}>
                    {!profileOpen ? (
                        <div>
                            <div className={'top-row'}>
                                <form className={"search-bar"}>
                                    <input
                                        type="text"
                                        placeholder={graphData ? "Search..." : ""} // Conditionally set placeholder
                                        onFocus={(e) => e.target.placeholder = ''} // Clear placeholder on focus
                                        onBlur={(e) => e.target.placeholder = graphData ? 'Search...' : ''} // Restore placeholder on blur
                                    />
                                    <button type="button" className={"search-button"}>🔍</button>
                                </form>
                                <div className={"popout-button"}>
                                    <BsChevronDoubleLeft className={'icon'} onClick={openNavbar}/>
                                </div>
                            </div>
                            <div className={'result-count'}>
                                <label className={'result-text'} htmlFor="resultCount">Results:</label>
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
                                {profileRows.length > 0 ? profileRows : <div>No profiles available.</div>} {/* Ensure profileRows is valid */}
                            </div>
                        </div>
                    ) : (
                        <div>

                            <ProfilePanel node={openNode} closeProfile={closeProfile}/>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}

export default NavBarLeft;
