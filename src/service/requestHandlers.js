

const formatQueryParams = (data) => {
    const queryParams = [];
    for (let key in data) {
        queryParams.push(`${key}=${encodeURIComponent(data[key])}`);
    }
    return "?" + queryParams.join("&");
};

const requestHandlers = {
    formatQueryParams: formatQueryParams
};

export default requestHandlers;

export { formatQueryParams };