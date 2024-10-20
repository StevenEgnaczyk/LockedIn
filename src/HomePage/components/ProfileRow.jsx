import React from "react";
import './ProfileRow.css';

const ProfileRow = ({ name, company, position, openProfile, linkedInUrl }) => {
    return (
        <div className={'profile-row'} onClick={openProfile}>
            <div className={'user-text'}>
                <a className={'linkedTitle'} href={linkedInUrl} target="_blank" rel="noopener noreferrer">
                    {name}
                </a>
                {company && <p>Company: {company}</p>}
                {position && <p>Position: {position}</p>}
            </div>
        </div>
    );
};

export default ProfileRow;
