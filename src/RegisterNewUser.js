import React from "react";
import PersonForm from "./PersonForm";
import {Link} from "react-router-dom";


const RegisterNewUser = (props) => {

    return <PersonForm mode="new" type={props.userType}/>;
};

const ChooseType = () => {
    return (
        <div>
            <button><Link to="/register/ridee">I need a ride</Link></button>
            <button><Link to="/register/rider">I can give rides</Link></button>
        </div>
    )
};

export { RegisterNewUser, ChooseType }