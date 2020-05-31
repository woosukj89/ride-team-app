import React from "react";
import {Link} from "react-router-dom";


const LoginPage = (props) => {

    return (
        <div>
            <form>
                <label htmlFor="tel">Enter your Phone Number:
                    <input id="tel"
                           name="tel"
                           type="text"
                           value={props.phone_number}
                           onChange={props.handleChange}/>
                </label>
                <input type="button" onClick={props.handleSubmit} value="Submit" />
            </form>
            {props.error &&
            <div>
               <p>{props.error}</p>
            </div>}
            <p>Not a user? <Link to="/register/choose-type">Sign up</Link></p>
        </div>
    );
};

export default LoginPage