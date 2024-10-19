import React from "react";
import { BsCrosshair } from "react-icons/bs";

import './ProfileRow.css'

const ProfileRow = ({openProfile, user}) => {

    const focusNode = () => {

    }

    return (
        <div className={'profile-row'} onClick={openProfile}>
            <div className={'user-text'}>
                <h2>name</h2>
                <p>company</p>
                <p>position</p>
            </div>
            <BsCrosshair className={'go-to-icon'} onClick={focusNode}/>

        </div>
    )
}

export default ProfileRow;