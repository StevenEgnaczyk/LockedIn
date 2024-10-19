import React, {useState} from "react";

import {Button} from "@nextui-org/react";
import { BsChevronDoubleRight, BsChevronDoubleLeft } from "react-icons/bs";

import './NavBarLeft.css'

const NavBarLeft = () => {

    const [isOpen, setOpen] = useState('false');

    const openNavbar = () => {
        setOpen(!isOpen);
    }

    return (
        <div className={"navbar-container"}>
            {isOpen ? (
                <Button className={"popout-button"} isIconOnly color="danger" aria-label="Like" disableRipple={true}>
                    <BsChevronDoubleRight className={'icon'} onClick={openNavbar}/>
                </Button>
            ) : (
                <div className={"open-navbar"}>
                    <div className={'top-row'}>
                        <form className={"search-bar"}>
                            <input
                                className={"search-bar"}
                                type="text"
                                placeholder="Search..." // Added placeholder
                                onFocus={(e) => e.target.placeholder = ''} // Clear placeholder on focus
                                onBlur={(e) => e.target.placeholder = 'Search...'} // Restore placeholder on blur
                            />
                            <button type="button"  className={"search-button"}>🔍</button>
                        </form>
                        <div className={"popout-button"}>
                            <BsChevronDoubleLeft className={'icon'} onClick={openNavbar}/>
                        </div>
                    </div>

                </div>
            )};

        </div>
    );
}
export default NavBarLeft;