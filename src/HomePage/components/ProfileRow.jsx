import React from "react";
import './ProfileRow.css';

const ProfileRow = ({ name, company, position, openProfile, profile_url}) => {
    return (
        <div className={'profile-row'} onClick={openProfile}>
            <div className={'user-text'} onClick={window.open(profile_url, '_blank')}>
                <h2 className={'profile-name'}>{name}</h2>
                {company && <p>Company: {company}</p>}
                {position && <p>Position: {position}</p>}
            </div>
        </div>
    );
};

export default ProfileRow;
