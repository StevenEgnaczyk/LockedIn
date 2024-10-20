import React from "react";
import './PositionControls.css'
import { BsCursor } from "react-icons/bs";
const PositionControls = ({ setResetCamera }) => {

    const handleResetCamera = () => {
        setResetCamera(true); // Trigger the camera reset
        setTimeout(() => setResetCamera(false), 500); // Reset the flag after a short delay
    };

    return (
        <div className={'controls-container'}>
            <BsCursor className={'center-icon'} onClick={handleResetCamera} />
        </div>
    )
}
export default PositionControls;