

// converts Date object to YYYY-MM-DD format
const getDate = (date) => {
    // return [date.getFullYear(),
    //     String(date.getMonth() + 1).padStart(2, "0"),
    //     String(date.getDate()).padStart(2, "0")].join("-");

    // better way
    return date.toISOString().split('T', 1)[0];
};

const findDateOfDay = (dayOfWeek, day) => {
    const yearMonthDay = dayOfWeek.split("-");
    const date = new Date(yearMonthDay[0], yearMonthDay[1] - 1, yearMonthDay[2]);
    const currentDay = date.getDay();
    const diff = date.getDate() - (currentDay === 0 ? -6 : currentDay) + day;
    return getDate(new Date(date.setDate(diff)));
};

const dayInLocalStringFormat = (dateString) => {
    // accepts YYYY-MM-DD and converts it to local string format
    const yearMonthDay = dateString.split("-");
    const date = new Date(yearMonthDay[0], yearMonthDay[1] - 1, yearMonthDay[2]);
    return date.toLocaleDateString();
};

const googleDistanceTextToMiles = (text) => {
    const reg = text.match(/(\d+(.\d+)?)\s+(\w+)?/);
    const miles = parseFloat(reg[1]);
    const unit = reg[3];
    if (unit === 'ft') {
        const toMiles = miles / 5280.0;
        return toMiles < 0.01 ? 0.0 : toMiles;
    }
    return miles;
};

const checkDefinedNotNull = (variable) => {
    if (Array.isArray(variable)) {
        return variable.every(v => typeof v !== 'undefined' && v !== null);
    }
    return typeof variable !== 'undefined' && variable !== null;
};

const objectIsEmpty = (obj) => {
    return Object.keys(obj).length === 0;
};

const helper = {
    getDate: getDate,
    findDateOfDay: findDateOfDay,
    dayInLocalStringFormat: dayInLocalStringFormat,
    googleDistanceTextToMiles: googleDistanceTextToMiles,
    objectIsEmpty: objectIsEmpty,
    checkDefinedNotNull: checkDefinedNotNull,
};

export default helper;