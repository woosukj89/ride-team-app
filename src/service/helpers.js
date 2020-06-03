

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

const helper = {
    getDate: getDate,
    findDateOfDay: findDateOfDay,
    dayInLocalStringFormat: dayInLocalStringFormat
};

export default helper;