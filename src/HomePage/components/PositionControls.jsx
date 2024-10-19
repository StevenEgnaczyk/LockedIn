import React from "react";

import './PositionControls.css'

import { BsCursor } from "react-icons/bs";
import { BsArrowCounterclockwise } from "react-icons/bs";

const PositionControls = ({resetCamera}) => {
    return (
        <div className={'controls-container'}>
            <BsCursor className={'center-icon'} onClick={resetCamera}/>
            <BsArrowCounterclockwise className={'refresh-icon'}/>
        </div>
    )
}

export default PositionControls;