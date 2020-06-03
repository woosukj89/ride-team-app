import userService from "./UserService";

const mapDaysAllowed = (days_allowed) => {
    const data_days = {};
    for (let el of days_allowed) {
        if (data_days[el.DAY_ALLOWED]) {
            const day = data_days[el.DAY_ALLOWED];
            day.types.push({id: el.ID, type_id: el.TYPE_ALLOWED});
        } else {
            const types = [{id: el.ID, type_id: el.TYPE_ALLOWED}];
            data_days[el.DAY_ALLOWED] = {
                types: types
            };
        }
    }

    let return_days_data = [];
    for (let day in data_days) {
        return_days_data.push({
            day_id: day,
            types: data_days[day].types
        })
    }

    return return_days_data;
};

// accepts a flat array of dayTypes and converts to a nested array in format of [{day: types(Object)}]
const dayTypeArrayToNestedObject = async (dayTypes) => {
    const dayRef = await userService.getDaysRef().then(daysRefArrayToObject);
    const typeRef = await userService.getTypesRef().then(typesRefArrayToObject);

    const dayTypesData = dayTypes.data;
    const days = new Set();
    const resultDayType = [];

    for (let dayType of dayTypesData) {
        const day = dayRef[dayType.DAY];
        const type = {type: typeRef[dayType.TYPE]};
        if (days.has(day)) {
            const resultDay = resultDayType.find(r => r.day === day);
            resultDay['types'].push(type);
        } else {
            resultDayType.push({day: day, types: [type]});
            days.add(day);
        }
    }

    return resultDayType;
};

const mapDayTypeUserArray = async (dayTypes) => {
    const dayRef = await userService.getDaysRef().then(daysRefArrayToObject);
    const typeRef = await userService.getTypesRef().then(typesRefArrayToObject);

    return dayTypes.map(dayType => {
        return {
            day: dayRef[dayType.DAY],
            type: typeRef[dayType.TYPE],
            rideeID: dayType.RIDER_ID,
            riderID: dayType.RIDEE_ID
        }
    });
};

const daysRefArrayToObject = (daysRef) => {
    return daysRef.data.reduce((days, day) => { return {...days, [day.ID]: day.DAY}}, {})
};

const typesRefArrayToObject = (typesRef) => {
    return typesRef.data.reduce((types, type) => { return {...types, [type.KEY]: type.RIDE_TYPE}}, {})
};

const createRiderRideeInfoMap = (data) => {
    return data.reduce((obj, user) => {
        const { ID, ...rest } = user;
        obj[ID] = rest;
        return obj;
    }, {});
};

const mapDayTypeToAvailableRiderOrRidee = (data) => {
    const userID = data[0].hasOwnProperty('RIDER_ID') ? 'RIDER_ID' : 'RIDEE_ID';
    return data.reduce((obj, row) => {
        if (!obj.hasOwnProperty(row.DAY)) {
            obj[row.DAY] = {};
        }
        const day = obj[row.DAY];
        const type = row.TYPE;
        if (!day.hasOwnProperty(type)) {
            day[type] = [];
        }
        day[type].push({id: row[userID], name: row.NAME});

        return obj;
    }, {})
};

const mapHistoryData = async (historyConfig, historyData) => {
    const dayRef = await userService.getDaysRef().then(daysRefArrayToObject);
    const typeRef = await userService.getTypesRef().then(typesRefArrayToObject);
    const mappedData = [];

    for (let historyRow of historyData) {
        const data = {};
        for (let historyCol in historyRow) {
            const fieldName = historyCol.toLowerCase();
            if (historyConfig[fieldName] && historyConfig[fieldName].include) {
                let value = historyRow[historyCol];
                if (fieldName === "day") {
                    value = dayRef[value];
                }
                if (fieldName === "type") {
                    value = typeRef[value];
                }
                data[fieldName] = value;
            }
        }
        mappedData.push(data);
    }

    return mappedData;
};

export {
    mapDaysAllowed,
    dayTypeArrayToNestedObject,
    daysRefArrayToObject,
    typesRefArrayToObject,
    mapHistoryData,
    mapDayTypeUserArray,
    mapDayTypeToAvailableRiderOrRidee,
    createRiderRideeInfoMap
};