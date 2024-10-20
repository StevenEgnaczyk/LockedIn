import React from "react";
import './ProfileRow.css';

const ProfileRow = ({ name, company, position, openProfile}) => {
    return (
        <div className={'profile-row'} onClick={openProfile}>
            <div className={'user-text'}>
                <h2 className={'profile-name'}>{name}</h2>
                {company && <p>Company: {company}</p>}
                {position && <p>Position: {position}</p>}
            </div>
        </div>
    );
};

export default ProfileRow;
