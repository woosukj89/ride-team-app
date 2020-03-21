import { properties, API_URLs } from "../properties";
// import axios from 'axios';

const userService = {
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
    }
};

export default userService