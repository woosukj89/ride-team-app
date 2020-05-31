import React, { useState, useEffect } from "react";
import userService from "./service/UserService";
import { Redirect } from "react-router-dom";

function Assigned(props) {

    console.log("in Assigned");
    const [assignment, setAssignment] = useState([]);

    useEffect(() => {
        const data = {
            queueID: props.queueID,
            userID: props.userID,
            role: props.role
        };
        userService.getUserAssignment(data).then(res => {
            setAssignment(res.data);
        });
    }, []);


    return (
        <div>
            <h2>Your Ride:</h2>
            <div>
                {assignment.map(day => (
                    <div>
                        <h4>{day.day}:</h4>
                        {day.map(type =>
                            <div>
                                <div>{type.type}</div>
                                <div>{type.names.map(name =>
                                    <div>
                                        {name}
                                    </div>
                                )}</div>
                            <button onClick={showAssignmentDetail(props.match.path, props.userID, props.role)}>
                                View Details
                            </button>
                        </div>
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
}

const showAssignmentDetail = (path, userID, role) => {
    return role === "rider" ?
        <Redirect to={`${path}/assignmentDetail/rider/${userID}`} /> :
        <Redirect to={`${path}/assignmentDetail/ridee/${userID}`} />
};

export default Assigned;