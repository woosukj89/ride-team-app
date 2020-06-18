import React, { useState, useEffect } from "react";
import { useParams, useLocation } from 'react-router-dom';
import userService from "./service/UserService";
    import {GoogleApiWrapper} from "google-maps-react";
import { Constants } from "./properties";
import helper from "./service/helpers";

function AssignmentDetail(props) {

    const location = useLocation();
    const { queueID, userID, role, day, type } = location.state;

    const distanceService = new props.google.maps.DistanceMatrixService();
    const [assignmentDetail, setAssignmentDetail] = useState({});
    const [loading, setLoading] = useState(false);
    const [loadingDistances, setLoadingDistances] = useState(false);
    const [error, setError] = useState(null);

    useEffect(() => {
        setLoading(true);
        setLoadingDistances(true);
        console.log('useEffect');

        if (!helper.checkDefinedNotNull([queueID, userID, day, type])) {
            setError("No queue or ride information available.")
        }

        const params = {
            riderID: userID,
            queueID: queueID,
            day: day,
            type: type
        };
        userService.getPendingRides(params).then(async res => {
            if (res.data) {
                const sortedRides = sortRides(res.data, type);
                console.log(sortedRides);
                setAssignmentDetail(sortedRides);
                setLoading(false);
                setDistances(sortedRides);
            } else {
                setError(res.error);
            }
            setLoading(false);
            setLoadingDistances(false);
        })
    }, []);

    const getDistances = (data) => {
        const locations = [
            data.originAddress,
            ...data.rides.map(ride => ride.rideeAddress),
            data.destinationAddress
        ];

        return new Promise((resolve, reject) =>
            distanceService.getDistanceMatrix({
                origins: locations,
                destinations: locations,
                travelMode: 'DRIVING',
                unitSystem: 1,
                avoidTolls: true,
            }, (res, status) => {
                if (status === "OK") {
                    resolve(res.rows.map(row => row.elements.map(element => helper.googleDistanceTextToMiles(element.distance.text))));
                } else {
                    reject(res.error);
                }
            }));
    };

    const setDistances = (sortedRides) => {
        getDistances(sortedRides).then(distanceMatrix => {
            console.log(distanceMatrix);
            const ridesWithDistances = sortedRides.rides.map((ride, idx) => {
                return {
                    ...ride,
                    distance: distanceMatrix[idx][idx+1]
                };
            });
            setAssignmentDetail(assignment => ({
               ...assignment,
               rides: ridesWithDistances,
               destinationDistance: distanceMatrix[distanceMatrix.length - 2][distanceMatrix.length - 1],
            }));
            setLoadingDistances(false);
        }).catch((err) => {
            console.log(err);
            setError(err);
        })
    };

    const sortRides = (data, type) => {

        if (data && data.rides) {
            let sortedRides = [...data.rides];
            if (Number.isInteger(data.rides[0].index) && data.rides[0].index >= 0) {
                sortedRides = sortedRides.sort((a,b) => a.index - b.index);
            }

            if (parseInt(type) === 0) {
                return {
                    ...data,
                    originName: data.rider,
                    originAddress: data.riderAddress,
                    destinationName: Constants.ChurchName,
                    destinationAddress: Constants.ChurchAddress,
                    rides: sortedRides
                }
            } else {
                return {
                    ...data,
                    originName: Constants.ChurchName,
                    originAddress: Constants.ChurchAddress,
                    destinationName: data.rider,
                    destinationAddress: data.riderAddress,
                    rides: sortedRides
                }
            }
        }

        return data;
    };

    return (
        <div>
            {helper.objectIsEmpty(assignmentDetail) || !assignmentDetail.rides.length ?
            <div>
                No Rides Available.
            </div> :
            !!error ?
            <div>
                { error }
            </div> :
            loading ?
            <div>
                Loading...
            </div> :
            <div>
                <div>
                    <div>{assignmentDetail.day}</div>
                    <div>{assignmentDetail.type}</div>
                </div>
                <div>
                    <div>
                        <div>Starting From:</div>
                        <div>
                            <div>{assignmentDetail.originName}</div>
                            <div>{assignmentDetail.originAddress}</div>
                        </div>
                    </div>
                    <div>
                        <div>Rides:</div>
                        {assignmentDetail.rides.map(ride =>
                            <div>
                                <div>{ride.ridee}</div>
                                <div>{ride.rideeAddress}</div>
                                <div>Est. Miles: {!loadingDistances ? `${ride.distance} mi` : "Loading..."}</div>
                                <div><button>Open in Maps</button></div>
                            </div>)}
                    </div>
                    <div>
                        <div>To:</div>
                        <div>
                            <div>{assignmentDetail.destinationName}</div>
                            <div>{assignmentDetail.destinationAddress}</div>
                            <div>Est. Miles: {!loadingDistances ? `${assignmentDetail.destinationDistance} mi` : "Loading..."}</div>
                            <div><button>Open in Maps</button></div>
                        </div>
                    </div>
                </div>
            </div>}
        </div>
    );
}

export default GoogleApiWrapper({
    apiKey: process.env.REACT_APP_GOOGLE_API_KEY
}) (AssignmentDetail);