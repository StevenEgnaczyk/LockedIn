import React, { useState } from "react";
import './PositionControls.css'
import { BsCursor } from "react-icons/bs";
import { BsArrowCounterclockwise } from "react-icons/bs";
import { FaPause, FaPlay } from "react-icons/fa";
const PositionControls = ({ setResetCamera }) => {

    const handleResetCamera = () => {
        setResetCamera(true); // Trigger the camera reset
        setTimeout(() => setResetCamera(false), 500); // Reset the flag after a short delay
    };

    return (
        <div className={'controls-container'}>
            <BsCursor className={'center-icon'} onClick={handleResetCamera} />
            <BsArrowCounterclockwise className={'refresh-icon'} />
        </div>
    )
}
export default PositionControls;