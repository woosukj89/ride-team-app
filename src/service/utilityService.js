import { properties, API_URLs } from "../properties";

const utilityService = {
    insertHistory(data) {
        return fetch(properties.apiHost + API_URLs.history,
            { method: 'POST', body: JSON.stringify(data),
                headers: { "Content-type": "application/json; charset=UTF-8"} })
            .then(res => res.json());
    },
};

export default utilityService