import React from "react";

import {Button} from "@nextui-org/react";
import { BsChevronDoubleRight } from "react-icons/bs";

import './NavBarLeft.css'

const NavBarLeft = () => {
    return (
        <div>
            <Button className={"popout-button"} isIconOnly color="danger" aria-label="Like">
                <BsChevronDoubleRight className={'icon'}/>
            </Button>
        </div>
    );
}
export default NavBarLeft;