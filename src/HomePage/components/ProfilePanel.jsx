import React from "react";

import './ProfilePanel.css'
import {BsChevronDoubleLeft} from "react-icons/bs";
const ProfilePanel = ({node, closeProfile, allNodes}) => {
    return (
        <div className={'big-profile'}>
            <div className={"popout-button"}>
                <BsChevronDoubleLeft className={'icon'} onClick={closeProfile}/>
            </div>
            <h1>{node.name}</h1>
            {node.company && <h3>Company: {node.company}</h3>}
            {node.position && <h3>Position: {node.position}</h3>}
            <p>You may know:
                {node.connections.length > 0 ? (
                    node.connections.map((connectionId, index) => {
                        // Find the connected node by ID
                        const connectedNode = allNodes.find(n => n.id === connectionId);
                        return connectedNode ? (
                            <span key={connectionId}>
            {connectedNode.name}{index < node.connections.length - 1 ? ', ' : ''}
          </span>
                        ) : null;
                    })
                ) : (
                    <span>No connections</span>
                )}
            </p>
            <p>{node.profile_url}</p>
        </div>
    )
}

export default ProfilePanel;