import React, { useContext, useState, useEffect } from "react";
import userService from "./service/UserService";
import { Link, Redirect } from "react-router-dom";
import { QueueContext } from "./context/QueueContext";
import helper from "./service/helpers";
import { UserContext } from "./context/user-context";

function Assigned(props) {

    const queueContext = useContext(QueueContext);
    const activeQueue = queueContext.activeQueue;
    const userContext = useContext(UserContext);
    const user = userContext.user;
    const [assignment, setAssignment] = useState({days: []});

    useEffect(() => {
        if (!activeQueue) {
            return;
        }
        const data = {
            queueID: activeQueue.ID,
            userID: user.id,
            role: user.role
        };
        userService.getAllPendingRides(data).then(res => {
            setAssignment(res.data);
        });
    }, [activeQueue]);


    return (
        <div>
            {!activeQueue ?
            <div>
                Sorry, there seems to be no queue available for this week.
            </div> :
            <div>
                <h2>Your Ride:</h2>
                <div>
                {assignment.days.map(day => (
                    <div>
                        <h4>{day.day} ({helper.dayInLocalStringFormat(day.date)}):</h4>
                        {day.types.map(type =>
                        <div>
                            <div>{type.type}</div>
                            <div>{type.rides.map(ride =>
                                <div>
                                    {user.role === "ridee" ? ride.rider : ride.ridee}
                                </div>)}
                            </div>
                            <Link to={{
                                pathname: `${props.match.path}/assignmentDetail/`,
                                state: {
                                    queueID: activeQueue.ID,
                                    userID: user.id,
                                    role: user.role,
                                    day: day.dayID,
                                    type: type.typeID,
                                }
                            }}>
                                <button>View Details</button>
                            </Link>
                        </div>
                        )}
                    </div>
                ))}
                </div>
            </div>}
        </div>
    );
}

// const showAssignmentDetail = (path, queueID, userID, role) => {
//     console.log(path);
//     return role === "rider" || role === "admin" ?
//         <Redirect to={`${path}/assignmentDetail/rider/${queueID}/${userID}`} /> :
//         <Redirect to={`${path}/assignmentDetail/ridee/${queueID}/${userID}`} />
// };

export default Assigned;