import { properties, API_URLs } from "../properties";
// import axios from 'axios';
import { formatQueryParams } from "./requestHandlers"

const userService = {
    login(data) {
        return fetch(properties.apiHost + API_URLs.login,
            { method: 'POST',
            body: JSON.stringify(data),
            headers: { "Content-type": "application/json; charset=UTF-8"}}).then(response => response.json())
    },
    getRiders() {
        return fetch(properties.apiHost + API_URLs.riders).then(response => response.json())
    },
    getRider(riderID) {
        return fetch(properties.apiHost + API_URLs.rider + riderID).then(response => response.json())
    },
    getRidees() {
        return fetch(properties.apiHost + API_URLs.ridees).then(response => response.json())
    },
    getRidee(rideeID) {
        return fetch(properties.apiHost + API_URLs.ridee + rideeID).then(response => response.json())
    },
    editRider(riderID, data) {
        return fetch(properties.apiHost + API_URLs.rider + riderID,
            {
                method: 'PATCH',
                body: JSON.stringify(data),
                headers: {"Content-type": "application/json; charset=UTF-8"}
            })
            .then(response => response.json())
    },
    editRidee(rideeID, data) {
        return fetch(properties.apiHost + API_URLs.ridee + rideeID,
            { method: 'PATCH',
                body: JSON.stringify(data),
                headers: { "Content-type": "application/json; charset=UTF-8"},
                credentials: 'same-origin',
                mode: "cors"})
            .then(response => response.json())
        // return axios.patch(properties.apiHost + API_URLs.ridee, data)
        //     .then(response => console.log(response))
        //     .catch(error => {
        //         if (error.response) {
        //             // The request was made and the server responded with a status code
        //             // that falls out of the range of 2xx
        //             console.log("Problem with response:", error.response.data)
        //         } else if (error.request) {
        //             // The request was made but no response was received
        //             // `error.request` is an instance of XMLHttpRequest in the browser and an instance of
        //             // http.ClientRequest in node.js
        //             console.log("Problem with request:", error.request)
        //         } else {
        //             // Something happened in setting up the request that triggered an Error
        //             console.log("Error", error.message)
        //         }
        //         console.log(error.config)
        //     })
    },
    addRider(data) {
        return fetch(properties.apiHost + API_URLs.rider,
            { method: 'POST',
                body: JSON.stringify(data),
                headers: { "Content-type": "application/json; charset=UTF-8"}})
            .then(response => response.json())
    },
    addRidee(data) {
        return fetch(properties.apiHost + API_URLs.ridee,
            { method: 'POST',
                body: JSON.stringify(data),
                headers: { "Content-type": "application/json; charset=UTF-8"}})
            .then(response => response.json())
    },
    getQueue(date) {
        return fetch(properties.apiHost + API_URLs.queue + "?date=" + date).then(response => response.json());
    },
    saveQueue(data) {
        if (data.ID) {
            return fetch(properties.apiHost + API_URLs.queue + data.ID,
                {
                    method: 'PATCH',
                    body: JSON.stringify(data),
                    headers: {"Content-type": "application/json; charset=UTF-8"}
                }).then(response => response.json());
        } else {
            return fetch(properties.apiHost + API_URLs.queue,
                {
                    method: 'POST',
                    body: JSON.stringify(data),
                    headers: {"Content-type": "application/json; charset=UTF-8"}
                })
        }
    },
    getDaysAllowed() {
        return fetch(properties.apiHost + API_URLs.daysAllowed).then(response => response.json());
    },
    getDaysRef() {
        return fetch(properties.apiHost + API_URLs.daysRef).then(response => response.json());
    },
    getTypesRef() {
        return fetch(properties.apiHost + API_URLs.typesRef).then(response => response.json());
    },
    getRideAvailability(params) {
        return fetch(properties.apiHost + API_URLs.rideAvailability + formatQueryParams(params)).then(response => response.json());
    },
    getRideNeeded(params) {
        return fetch(properties.apiHost + API_URLs.rideNeeded + formatQueryParams(params)).then(response => response.json());
    },
    saveRiderAvailability(riderID, data) {
        return fetch(properties.apiHost + API_URLs.rideAvailability + riderID,
            { method: "PUT",
                body: JSON.stringify(data),
                headers: { "Content-type": "application/json; charset=UTF-8"}})
            .then(response => response.json());
    },
    saveRideRequest(rideeID, data) {
        return fetch(properties.apiHost + API_URLs.rideNeeded + rideeID,
            { method: "PUT",
                body: JSON.stringify(data),
                headers: { "Content-type": "application/json; charset=UTF-8"}})
            .then(response => response.json());
    },
    getUserAssignment(data) {
        return fetch(properties.apiHost + API_URLs.assignment).then(response => response.json());
    },
    markAssignmentAsComplete(data) {
        return fetch(properties.apiHost + API_URLs.assignment,
            {
                method: "PUT",
                body: JSON.stringify(data),
                headers: { "Content-type": "application/json; charset=UTF-8"}
            }).then(response => response.json());
    },
    getHistory(params) {
        return fetch(properties.apiHost + API_URLs.history + formatQueryParams(params)).then(response=>response.json());
    },
    getRideDetail(type, id) {
        if (type === "history") {
            return fetch(properties.apiHost + API_URLs.historyDetail + id).then(response => response.json());
        }
    }
};

export default userService