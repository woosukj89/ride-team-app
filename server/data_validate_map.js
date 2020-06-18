

module.exports = {
    mapDaysAllowed: function(days_allowed) {
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
    },
    mapPendingRidesByRider: function (pendingRidesArray) {
        const firstRow = pendingRidesArray[0] || { };
        const result = {
            date: firstRow.DATE,
            dayID: firstRow.DAY,
            day: firstRow.DAY_NAME,
            typeID: firstRow.TYPE,
            type: firstRow.TYPE_NAME,
            riderID: firstRow.RIDER_ID,
            rider: firstRow.RIDER,
            riderAddress: firstRow.RIDER_ADDRESS,
        };
        result['rides'] = pendingRidesArray.map(row => (
            {
                index: row.INDEX,
                ridee: row.RIDEE,
                rideeID: row.RIDEE_ID,
                rideeAddress: row.RIDEE_ADDRESS,
                cancelled: row.CANCELLED
            }
        ));

        return result;
    },
    mapPendingRidesByDayType: function(pendingRidesArray) {
        const sorted = pendingRidesArray.sort((a, b) => a.DAY - b.DAY || a.TYPE - b.TYPE || a.RIDEE_ID - b.RIDEE_ID);
        let prevDay, prevType;
        const result = {
            days: []
        };
        sorted.forEach((row) => {
            if (row.DAY !== prevDay) {
                result.days.push({dayID: row.DAY, day: row.DAY_NAME, date: row.DATE, types: []});
                prevDay = row.DAY;
            }
            const day = result.days[result.days.length-1];
            if (row.TYPE !== prevType) {
                day.types.push({typeID: row.TYPE, type: row.TYPE_NAME, rides: []});
                prevType = row.TYPE;
            }
            const type = day.types[day.types.length-1];
            type.rides.push({
                rider: row.RIDER,
                riderID: row.RIDER_ID,
                riderAddress: row.RIDER_ADDRESS,
                ridee: row.RIDEE,
                rideeID: row.RIDEE_ID,
                rideeAdress: row.RIDEE_ADDRESS,
                index: row.INDEX,
                cancelled: row.CANCELLED})
        });

        return result;
    }
};