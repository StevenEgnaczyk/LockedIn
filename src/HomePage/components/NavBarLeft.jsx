import React, { useState, useEffect } from "react";
import { Button } from "@nextui-org/react";
import { BsChevronDoubleRight, BsChevronDoubleLeft } from "react-icons/bs";
import { useGraphData } from './GraphDataContext';  // Import your GraphDataContext
import './NavBarLeft.css';
import ProfileRow from "./ProfileRow";
import ProfilePanel from "./ProfilePanel";
import { stemmer } from 'stemmer';

const NavBarLeft = ({ activeNode }) => {
    const { graphData } = useGraphData();  // Get graphData from context
    const [isOpen, setOpen] = useState(false);
    const [resultCount, setResultCount] = useState(10); // Default to 10 results
    const maxResults = 25; // Maximum results

    const [openNode, setOpenNode] = useState(null);
    const [search, setSearch] = useState(''); // State for search input
    const [filteredNodes, setFilteredNodes] = useState([]); // State for filtered nodes

    // Effect to auto-populate filtered nodes when graphData changes
    useEffect(() => {
        if (graphData && graphData.nodes) {
            setFilteredNodes(graphData.nodes.slice(0, resultCount)); // Set initial filtered nodes
        }
    }, [graphData, resultCount]); // Run effect when graphData or resultCount changes

    // Effect to handle opening profile based on activeNode
    useEffect(() => {
        if (activeNode) {
            setOpenNode(activeNode);
            setOpen(true); // Open the navbar when there's an active node
        } else {
            setOpenNode(null);
            setOpen(false); // Close the navbar if there's no active node
        }
    }, [activeNode]); // Trigger effect when activeNode changes

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
        setOpenNode(node);
    }

    const closeProfile = () => {
        setOpenNode(null);
    }

    const getStems = (text) => {
        return text.toLowerCase().split(/\s+/).map(word => stemmer(word));
    };

    const calculateRelevanceScore = (nodeStems, searchStems) => {
        let score = 0;
        const matchedStems = new Set();

        for (let searchStem of searchStems) {
            for (let nodeStem of nodeStems) {
                if (nodeStem.includes(searchStem) && !matchedStems.has(nodeStem)) {
                    score += searchStem === nodeStem ? 2 : 1; // Full match scores higher
                    matchedStems.add(nodeStem);
                    break;
                }
            }
        }

        return score;
    };

    const handleSearch = (event) => {
        event.preventDefault();
        if (!graphData || !graphData.nodes) return;

        if (!search.trim()) {
            setFilteredNodes(graphData.nodes.slice(0, resultCount)); // Reset to initial nodes if search is empty
            return;
        }

        const searchStems = getStems(search);

        const rankedNodes = graphData.nodes.map(node => {
            const nodeText = `${node.name} ${node.company} ${node.position}`;
            const nodeStems = getStems(nodeText);
            const relevanceScore = calculateRelevanceScore(nodeStems, searchStems);
            return { ...node, relevanceScore };
        }).filter(node => node.relevanceScore > 0)
            .sort((a, b) => b.relevanceScore - a.relevanceScore);

        setFilteredNodes(rankedNodes.slice(0, resultCount));
    };

    const handleInputChange = (event) => {
        setSearch(event.target.value); // Update search state
    }

    // Prepare profileRows based on filteredNodes
    const profileRows = filteredNodes.map((node, index) => (
        <ProfileRow key={index} openProfile={() => openProfile(node)} 
        name={node.name}
        company={node.company} 
        position={node.position}
        linkedInUrl={node.profile_url}/>
    ));

    return (
        <div className={"navbar-container"}>
            {!isOpen ? (
                <Button className={"popout-button"} isIconOnly color="danger" aria-label="Like" disableRipple={true}>
                    <BsChevronDoubleRight className={'icon'} onClick={openNavbar} />
                </Button>
            ) : (
                <div className={"open-navbar-left"}>
                    {openNode ? (
                        <div>
                            <ProfilePanel node={openNode} closeProfile={closeProfile} />
                        </div>
                    ) : (
                        <div>
                            <div className={'top-row'}>
                                <form className={"search-bar"} onSubmit={handleSearch}>
                                    <input
                                        type="text"
                                        value={search}
                                        onChange={handleInputChange}
                                        placeholder={graphData ? "Search..." : ""}
                                        onFocus={(e) => e.target.placeholder = ''}
                                        onBlur={(e) => e.target.placeholder = graphData ? 'Search...' : ''}
                                    />
                                    <button type="submit" className={"search-button"}>🔍</button>
                                </form>
                                <div className={"popout-button"}>
                                    <BsChevronDoubleLeft className={'icon'} onClick={openNavbar} />
                                </div>
                            </div>
                            <div className={"result-count"}>
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
                                {profileRows.length > 0 ? profileRows : <div>No profiles available.</div>}
                            </div>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}

export default NavBarLeft;
