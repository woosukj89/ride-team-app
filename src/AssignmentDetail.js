import React, { useState, useEffect } from "react";
import userService from "./service/UserService";

function AssignmentDetail(props) {

    const [assignmentDetail, setAssignmentDetail] = useState([]);

    useEffect(() => {
        const params = {
            riderID: props.userID,
            queueID: props.queueID,
            day: props.day,
            type: props.type
        };
        userService.getAssignments(params).then(res => {
            setAssignmentDetail(res.data);
        })
    }, []);

    return (
        <div>
            {/*<div>*/}
            {/*    <div>{day}</div>*/}
            {/*    <div>{type}</div>*/}
            {/*</div>*/}
            {/*<div>*/}
            {/*    <div>*/}
            {/*        <div>From</div>*/}
            {/*        <div>*/}
            {/*            <div>{rider_name}</div>*/}
            {/*            <div>{rider_address}</div>*/}
            {/*            <div><button>Edit</button></div>*/}
            {/*        </div>*/}
            {/*    </div>*/}
            {/*    <div>*/}
            {/*        <div>To</div>*/}
            {/*        {to.map(t =>*/}
            {/*        <div>*/}
            {/*           <div>{t.ridee_name}</div>*/}
            {/*           <div>{t.ridee_address}</div>*/}
            {/*           <div><button>Edit</button></div>*/}
            {/*            <div>Est. Miles: {t.miles}</div>*/}
            {/*           <div><button>Open in Maps</button></div>*/}
            {/*        </div>)}*/}
            {/*    </div>*/}
            {/*</div>*/}
        </div>
    );
}

export default AssignmentDetail;