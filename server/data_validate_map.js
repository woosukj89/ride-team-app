

module.exports = {
    mapDaysAllowed: function(days_allowed) {
    //     // queue_data = [{
    //     //     ID: 0,
    //     //     START_DATE: "2020/03/16",
    //     //     END_DATE: "2020/03/22",
    //     //     LAST_DAY: "2020/03/18",
    //     //     ACTIVE: 1
    //     // }];
    //     days_allowed = [{
    //         ID: 0,
    //         DAY_ALLOWED: 0,
    //         TYPE_ALLOWED: 0
    //     },
    //     {
    //         ID: 1,
    //         DAY_ALLOWED: 0,
    //         TYPE_ALLOWED: 1
    //     },
    //     {
    //         ID: 2,
    //         DAY_ALLOWED: 1,
    //         TYPE_ALLOWED: 0
    //     },
    //     {
    //         ID: 3,
    //         DAY_ALLOWED: 1,
    //         TYPE_ALLOWED: 1
    //     }];
    //
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
    }

};