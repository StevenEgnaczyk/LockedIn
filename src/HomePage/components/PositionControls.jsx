import React, { useState } from "react";

import './PositionControls.css'

import { BsCursor } from "react-icons/bs";
import { BsArrowCounterclockwise } from "react-icons/bs";
import { FaPause, FaPlay } from "react-icons/fa";

const PositionControls = ({resetCamera, pause}) => {
    const [isPaused, setIsPaused] = useState(false);

    const handlePauseToggle = () => {
        setIsPaused(!isPaused);
        pause();
    };

    return (
        <div className={'controls-container'}>
            <BsCursor className={'center-icon'} onClick={resetCamera}/>
            <BsArrowCounterclockwise className={'refresh-icon'}/>
            <div className={'pause-icon'} onClick={handlePauseToggle}>
                {isPaused ? <FaPlay /> : <FaPause />}
            </div>
        </div>
    )
}

export default PositionControls;
