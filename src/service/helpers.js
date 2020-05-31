

// converts Date object to YYYY-MM-DD format
const getDate = (date) => {
    // return [date.getFullYear(),
    //     String(date.getMonth() + 1).padStart(2, "0"),
    //     String(date.getDate()).padStart(2, "0")].join("-");

    // better way
    return date.toISOString().split('T', 1)[0];
};

const helper = {
    getDate: getDate
};

export default helper;