import React, { useState, useEffect } from "react";
import userService from "./service/UserService";
import { GoogleApiWrapper } from "google-maps-react";
import { useParams } from 'react-router-dom';
import { Constants } from "./properties";

const RideDetail = (props) => {

    const [rideDetail, setRideDetail] = useState(null);
    const [loading, setLoading] = useState(true);
    const [distance1, setDistance1] = useState(null);
    const [distance2, setDistance2] = useState(null);
    const [gettingDistance, setGettingDistance] = useState(true);
    const { recordID } = useParams();
    const churchAddress = Constants.ChurchAddress;
    const distanceService = new props.google.maps.DistanceMatrixService();

    const riderMode = props.role === "rider";
    const rideeMode = props.role === "ridee";
    const adminMode = props.role === "admin";

    useEffect(() => {
        userService.getRideDetail(props.status, recordID).then(res => {
            const data = res.data;
            setRideDetail(res.data);
            setLoading(false);
            if (!data.DISTANCE1 || !data.DISTANCE2) {
                let origins, destinations = [];
                if (data.RIDE_TYPE === "To Church") {
                    origins = [data.RIDER_ADDRESS, data.RIDEE_ADDRESS];
                    destinations = [data.RIDEE_ADDRESS, churchAddress];
                } else if (data.RIDE_TYPE === "Return Home") {
                    origins = [data.RIDER_ADDRESS, data.RIDEE_ADDRESS];
                    destinations = [data.RIDEE_ADDRESS, churchAddress];
                }
                distanceService.getDistanceMatrix({
                    origins: origins,
                    destinations: destinations,
                    travelMode: 'DRIVING',
                    unitSystem: 1,
                    avoidTolls: true,
                }, (res, status) => {
                    if (status === "OK") {
                        setDistanceHelper(res.rows);
                        setGettingDistance(false);
                    }
                })
            }
        })
    }, []);

    const setDistanceHelper = (distanceMatrix) => {
        setDistance1(distanceMatrix[0].elements[0].distance.text);
        setDistance2(distanceMatrix[1].elements[1].distance.text);
    };

    return (

        <div>
            <div>

            </div>
            {!loading && <div>
                <div>
                    <div>
                        <div>{rideDetail.RIDER_NAME}</div>
                        {(riderMode || adminMode) &&
                        <div>{rideDetail.RIDER_ADDRESS}</div>}
                    </div>
                    <div>giving ride to</div>
                    <div>
                        <div>{rideDetail.RIDEE_NAME}</div>
                        <div>address: {rideDetail.RIDEE_ADDRESS}</div>
                        <div>phone: {rideDetail.RIDEE_PHONE}</div>
                    </div>
                    {rideDetail.RIDE_TYPE === "To Church" &&
                    <div>
                        To Church
                    </div>}
                    {rideDetail.RIDE_TYPE === "Return Home" &&
                    <div>
                        Return Home
                    </div>}
                    {(riderMode || adminMode) &&
                    <div>
                        Estimated Miles:
                        {!gettingDistance &&
                        <div>
                            {rideDetail.RIDE_TYPE === "To Church" &&
                            <div>
                                <div>From Home to Ridee Location: {distance1}</div>
                                <div>From Ridee Location to Church: {distance2}</div>
                            </div>}
                            {rideDetail.RIDE_TYPE === "Return Home" &&
                            <div>
                                <div>From Church to Ridee Location: {distance1}</div>
                                <div>From Ridee Location to Home: {distance2}</div>
                            </div>}
                        </div>}
                        {gettingDistance && <div>Calculating Distances...</div>}
                        <div>
                            <button>Open Ridee's Location in Maps</button>
                        </div>
                    </div>}
                </div>
                {(riderMode || adminMode) &&
                <div>
                    <div>
                        <button>Mark Ride as Complete</button>
                    </div>
                    <div>
                        <button>Cancel Ride</button>
                    </div>
                </div>}
                <div>
                    <div>
                        Ride Complete
                    </div>
                    <div>
                        Ride Cancelled
                    </div>
                </div>
            </div>}
            {loading &&
            <div>
                Loading...
            </div>}
        </div>

    )
};

export default GoogleApiWrapper({
    apiKey: process.env.REACT_APP_GOOGLE_API_KEY
})(RideDetail)