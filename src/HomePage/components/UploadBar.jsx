import React from "react";
import FileUpload from "./FileUpload";
import UserMerge from "./UserMerge";
import './UploadBar.css'

const UploadBar = () => {
    return (
        <div className={'upload-container'}>
            <FileUpload />
            <UserMerge />
        </div>
    )
}

export default UploadBar;