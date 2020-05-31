import React, { useEffect, useState } from "react";
import userService from "./service/UserService";
import helper from "./service/helpers";
import { Link } from "react-router-dom";
import Queue from "./Queue";

const AdminQueue = (props) => {

    const [activeQueue, setActiveQueue] = useState([]);
    const [availableRiders, setAvailableRiders] = useState([]);
    const [rideNeeded, setRideNeeded] = useState([]);
    const [ridersList, setRidersList] = useState([]);
    const [rideesList, setRideesList] = useState([]);
    const [pendingRiders, setPendingRiders] = useState([]);
    const [pendingRidees, setPendingRidees] = useState([]);

    useEffect(() => {
        userService.getQueue(helper.getDate(new Date())).then((queue) => {
            if (queue.data) {
                setActiveQueue(queue.data);
                userService.getRiders().then(res => {
                    setRidersList(res.data.map(v => ({id: v.ID, name: v.NAME})));
                });
                userService.getRidees().then(res => {
                    setRideesList(res.data.map(v => ({id: v.ID, name: v.NAME})))
                })
            }
        });
    }, []);

    const addRider = () => {

    };

    const removeRider = () => {

    };

    const addPendingRider = () => {

    };

    const addRidee = () => {

    };

    const removeRidee = () => {

    };

    const addPendingRidee = () => {

    };

    return (
        <div>
            {activeQueue &&
            <div>
                <div>
                    <div>
                        Week of {activeQueue.START_DATE}
                    </div>
                    <div>
                        <h2>Available Riders</h2>
                    </div>
                    <div>
                        {ridersList.map(rider =>
                            <div key={rider.id}>
                                <h4>{rider.name}</h4>
                                <Queue queueID={activeQueue.ID} userID={rider.id} role="rider" />
                            </div>
                        )}
                    </div>
                </div>
                <div>
                    <div>
                        <h2>Ridees List</h2>
                    </div>
                    <div>
                        {rideesList.map(ridee =>
                            <div key={ridee.id}>
                                <h4>{ridee.name}</h4>
                                <Queue queueID={activeQueue.ID} userID={ridee.id} role="ridee" />
                            </div>
                        )}
                    </div>
                </div>
            </div>}
            {!activeQueue &&
            <div>
                There is no active queue. Click below to add new queue.
                <div>
                    <Link to="editQueue">Add New Queue</Link>
                </div>
            </div>}
        </div>
    )
};

export default AdminQueue;