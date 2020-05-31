import React from "react";
import {uniqueCount} from "react-table/src/aggregations";


const DefaultColumnFilter =
    ({column: { filterValue, preFilteredRows, setFilter },}) => {
    const count = preFilteredRows.length;

    return (
        <input
            value={filterValue || ''}
            onChange={e => {
                setFilter(e.target.value || undefined) // Set undefined to remove the filter entirely
            }}
            placeholder={`Search ${count} records...`}
        />
    )
};

const CancelledColumnFilter =
    ({column: { filterValue, setFilter },}) => {
    const setFilterValue = (checked) => {
        if (checked) {
            setFilter('0');
        } else {
            setFilter(undefined);
        }
    };
    return (
        <label>Don't show cancelled rides
            <input type="checkbox"
                   onChange={e => setFilterValue(e.target.checked)}
                   checked={filterValue === '0'}/>
        </label>
    );
};

const uniqueSum = (leafValues, aggregatedValues) => {
    console.log(leafValues, aggregatedValues);
};

const totalCount = (values, row, column) => {
    console.log(row);
};

const first = (leafValues) => {
    return leafValues[0];
};

const defaultConfig = {
    id: {include: true},
    date: {include: true},
    day: {include: true},
    ridee: {include: true},
    rider_address: {include: false},
    ridee_address: {include: false},
    rider: {include: true},
    type: {include: true},
    distance_church: {include: false},
    distance_home: {include: false},
    cancelled: {include: true}
};

const riderConfig = {
    ...defaultConfig,
    rider: {include: false}
};

const rideeConfig = {
    ...defaultConfig,
    ridee: {include: false},
    cancelled: {include: false}
};

const adminConfig = {
    ...defaultConfig,
    rider: {include: true},
    rider_address: {include: true},
    type: {include: true, aggregate: 'count'},
    ridee_address: {include: true},
    distance_church: {include: true, aggregate: 'sum'},
    distance_home: {include: true, aggregate: 'sum'},
    cancelled: {include: true, Filter: CancelledColumnFilter}
};

const createColumn = (setting, headerName, accessorName) => {
    const defaultSettings = {};
    if(setting.aggregate) {
        defaultSettings['aggregate'] = setting.aggregate;
    }
    if(setting.aggregateValue) {
        defaultSettings['aggregateValue'] = setting.aggregateValue;
    }
    if(setting.Filter) {
        defaultSettings['Filter'] = setting.Filter;
        defaultSettings['filter'] = 'equals';
    }

    return setting.include ? {
        'Header': headerName,
        'accessor': accessorName,
        ...defaultSettings
    } : null;
};

const columnsConfig = (historyConfig) => {
    if(!historyConfig) { return [] }
    return [
        createColumn(historyConfig.date, 'Date', 'date'),
        createColumn(historyConfig.day, 'Day', 'day'),
        createColumn(historyConfig.rider, 'Rider', 'rider'),
        createColumn(historyConfig.rider_address, 'Rider Address', 'rider_address'),
        createColumn(historyConfig.type, 'Type', 'type'),
        createColumn(historyConfig.ridee, 'Ridee', 'ridee'),
        createColumn(historyConfig.ridee_address, 'Ridee Address', 'ridee_address'),
        createColumn(historyConfig.distance_church, 'Distance Church', 'distance_church'),
        createColumn(historyConfig.distance_home, 'Distance Home', 'distance_home'),
        createColumn(historyConfig.cancelled, 'Cancelled?', 'cancelled')
    ].filter(Boolean);
};

export { rideeConfig, riderConfig, adminConfig, columnsConfig, DefaultColumnFilter };

