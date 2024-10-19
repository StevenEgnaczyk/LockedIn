import React from "react";

import './ProfileRow.css'

const ProfileRow = () => {


    return (
        <div className={'profile-row'}>
            <img className={'profile-pic'} src={'./profilePic.jpeg'}/>
            <div className={'user-text'}>
                <h2>Name here</h2>
                <p>desc or something</p>
            </div>
        </div>
    )
}

export default ProfileRow;