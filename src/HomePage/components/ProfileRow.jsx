import React from "react";
import './ProfileRow.css';

const ProfileRow = ({ name, company, position }) => {
    return (
        <div className={'profile-row'}>
            <div className={'user-text'}>
                <h2>{name}</h2>
                <p>Company: {company}</p>
                <p>Position: {position}</p>
            </div>
        </div>
    );
};

export default ProfileRow;
