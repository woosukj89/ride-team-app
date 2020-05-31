import React, {useEffect, useState} from 'react';
import userService from "./service/UserService";
import { Link } from 'react-router-dom';
import { dayTypeArrayToNestedObject } from "./service/responseHandlers";

function Queue(props) {

    const [dayTypeSelections, setDayTypeSelections] = useState([]);

    useEffect(() => {
        const params = {
            queueID: props.queueID,
            userID: props.userID
        };

        if (props.role === "rider") {
            userService.getRideAvailability(params).then(async availability => {
                setDayTypeSelections(await dayTypeArrayToNestedObject(availability));
            })
        }
        else if (props.role === "ridee") {
            userService.getRideNeeded(params).then(async requests => {
                setDayTypeSelections(await dayTypeArrayToNestedObject(requests));
            })
        }
    }, []);

    return (
        <div>
            {!dayTypeSelections.length ?
            <div>
                {props.role === "rider" &&
                <div>
                    <h4>Can you give ride this week?</h4>
                    <button>
                        <Link to={"/queue/availability/" + props.queueID + "/" + props.userID}>Select Availability</Link>
                    </button>
                </div>}
                {props.role === "ridee" &&
                <div>
                    <h4>Do you need rides this week?</h4>
                    <button>
                        <Link to="/queue/ride-request">Request Rides</Link>
                    </button>
                </div>}
            </div> :
            <div>
                <h4>{props.role === "rider" ? "You can give rides on:" : "You requested rides on:"}</h4>
                {dayTypeSelections.map(day => (
                <div>
                    <h4>{day.day}</h4>
                    <div>
                    {day.types.map(type => (
                        <div>
                            {type.type}
                        </div>))}
                    </div>
                </div>))}
                {props.role === "rider" &&
                <button>
                    <Link to={"/queue/availability/" + props.queueID + "/" + props.userID}>Modify Availability</Link>
                </button>}
                {props.role === "ridee" &&
                <button>
                    <Link to="/queue/ride-request">Modify Request</Link>
                </button>}
            </div>}
        </div>
    );
}

export default Queue;