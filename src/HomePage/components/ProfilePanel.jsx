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
            <p>{node.profile_url}</p>
        </div>
    )
}

export default ProfilePanel;
