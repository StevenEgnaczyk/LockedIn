import React, { useState } from "react";
import './PositionControls.css'
import { BsCursor } from "react-icons/bs";
import { BsArrowCounterclockwise } from "react-icons/bs";
import { FaPause, FaPlay } from "react-icons/fa";
const PositionControls = ({resetCamera}) => {
    return (
        <div className={'controls-container'}>
            <BsCursor className={'center-icon'} onClick={resetCamera}/>
            <BsArrowCounterclockwise className={'refresh-icon'}/>
        </div>
    )
}
export default PositionControls;