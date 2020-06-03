import React, { useState, useEffect, useRef } from "react";
import AssignReport from "./AssignReport";
import {Constants} from "./properties";
import userService from "./service/UserService";
import helper from "./service/helpers";
import {createRiderRideeInfoMap, mapDayTypeToAvailableRiderOrRidee} from "./service/responseHandlers";
import html2canvas from "html2canvas";


const Assign = (props) => {

    const pageRef = {
        0: 'assignment',
        1: 'report'
    };

    const activeQueue = useRef(null);
    const rideeInfoMap = useRef(null);
    const riderInfoMap = useRef(null);

    const [page, setPage] = useState(0);
    const [assignRows, setAssignRows] = useState([]);
    const [daysTypesAllowed, setDaysTypesAllowed] = useState([]);
    const [ridesNeeded, setRidesNeeded] = useState({});
    const [availableRiders, setAvailableRiders] = useState({});
    const [errors, setErrors] = useState([]);
    const [loading, setLoading] = useState(false);
    const [reportData, setReportData] = useState({days: []});
    const [saving, setSaving] = useState(false);
    const [assignmentComplete, setAssignmentComplete] = useState(false);

    const fetchDependencyData = async () => {
        activeQueue.current = await userService.getQueue(helper.getDate(new Date())).then(res => res.data);
        rideeInfoMap.current = await userService.getRidees().then(res => createRiderRideeInfoMap(res.data));
        riderInfoMap.current = await userService.getRiders().then(res => createRiderRideeInfoMap(res.data));
    };

    useEffect(() => {
        const fetch = async () => {
            setDaysTypesAllowed(await userService.getDaysAllowed().then(res => res.data));

            if (!activeQueue.current) {
                raiseError("No Active Queue at this time.");
                return;
            }

            const initialRows = await userService.getRideNeeded({ queueID: activeQueue.current.ID }).then(res => res.data);
            initialRows.forEach(ridee => addAssignRow(ridee));
            setRidesNeeded(mapDayTypeToAvailableRiderOrRidee(initialRows));

            setAvailableRiders(await userService.getRideAvailability({ queueID: activeQueue.current.ID })
                .then(res => mapDayTypeToAvailableRiderOrRidee(res.data)));
        };
        setLoading(true);
        fetchDependencyData().then(() => { fetch() });
        setLoading(false);
    }, []);

    const addAssignRow = (data) => {
        const ridee = data.RIDEE_ID && rideeInfoMap.current ? rideeInfoMap.current[data.RIDEE_ID] : {};
        const newRow = {
            date: data.hasOwnProperty('DAY') ? helper.findDateOfDay(getDayOfWeek(), data.DAY) : '',
            day: data.hasOwnProperty('DAY') ? data.DAY.toString() : null,
            type: data.hasOwnProperty('TYPE') ? data.TYPE.toString() : null,
            ridee: data.RIDEE_ID || '',
            rideeAddress: ridee.ADDRESS || '',
            rideeLeader: ridee.LEADER || '',
            tel: ridee.PHONE_NUMBER || '',
            rider: -1,
            riderAddress: '',
            riderLeader: '',
            manualRideeInput: false,
            manualRiderInput: false
        };
        setAssignRows(assignRows => assignRows.concat(newRow));
    };

    const handleChange = (id, event) => {
        const target = event.target;
        let name = target.name;
        const value = target.value;
        const newValues = {};

        if (name === "day") {
            newValues["date"] = helper.findDateOfDay(getDayOfWeek(), value);
        }

        if (name === "ridee-select" && value !== "custom") {
            const ridee = rideeInfoMap.current ? rideeInfoMap.current[value] : {};
            newValues['rideeAddress'] = ridee.ADDRESS;
            newValues['rideeLeader'] = ridee.LEADER;
            newValues['tel'] = ridee.PHONE_NUMBER;
        }

        if (name === "ridee-select" && value === "custom") {
            newValues['manualRideeInput'] = true;
        }

        if (name === "rider-select" && value !== "custom") {
            const rider = riderInfoMap.current ? riderInfoMap.current[value] : {};
            newValues['riderLeader'] = rider.LEADER;
        }

        if (name === "rider-select" && value === "custom") {
            newValues['manualRiderInput'] = true;
        }

        if (name === "ridee-select" || name === "ridee-input") {
            name = "ridee";
        }

        if (name === "rider-select" || name === "rider-input") {
            name = "rider"
        }

        newValues[name]= value;

        const newAssignRows = [...assignRows];
        newAssignRows.splice(id, 1, {...assignRows[id], ...newValues});
        setAssignRows(newAssignRows);
    };

    const getDayOfWeek = () => {
        return activeQueue.current ? activeQueue.current.START_DATE : helper.getDate(new Date());
    };

    const addRow = () => {
        addAssignRow({});
    };

    const deleteRow = (id) => {
        const newAssignRows = [...assignRows];
        newAssignRows.splice(id, 1);
        setAssignRows(newAssignRows);
    };

    const saveReport = () => {
        const report = document.getElementById("assignment-report");
        window.scrollTo(0, 0);
        html2canvas(report)
            .then(function(canvas) {
                const dataURL = canvas.toDataURL("jpeg");
                const report = window.open();
                report.document.write('<iframe src="' + dataURL + '" frameborder="0" style="border:0; top:0; left:0; bottom: 0; height:100%; width: 100%"></iframe>')
            });
    };

    const createReport = () => {
        const fieldErrors = validateFields();
        if (fieldErrors.length) {
            setErrors(errors => errors.concat(fieldErrors));
            return;
        }
        setErrors([]);
        setReportData(mapForReport());
        setPage(1);
    };

    const validateFields = () => {
        const emptyFields = [];
        assignRows.forEach((row, idx) => {
            if (!row.rider || (Number.isInteger(row.rider) ? row.rider === -1 : !(row.rider.trim()))) {
                emptyFields.push(`Required: ${idx} - Rider`);
            }
            if (!row.ridee || (Number.isInteger(row.ridee) ? !(row.ridee.toString().trim()) : false)) {
                emptyFields.push(`Required: ${idx} - Ridee`);
            }
        });
        return emptyFields;
    };

    const completeAssignment = () => {
        setSaving(true);
        const data = mapData();
        if (!activeQueue.current || !activeQueue.current.ID) {
            setErrors(["No Active Queue Available. Set up a queue first."]);
            return;
        }
        userService.insertPendingRides(data).then(res => {
            if (res.message === "success") {
                const queueData = {
                    ID: activeQueue.current.ID,
                    ASSIGNMENT_COMPLETE: 1
                };
                userService.saveQueue(queueData).then(res => {
                    if (res.message === "success") {
                        setAssignmentComplete(true);
                    } else {
                        setErrors(errors => errors.concat(res.error));
                    }
                })
            } else {
                setErrors([res.error]);
            }
            setSaving(false);
        });
    };

    const mapData = () => {
        return {
            data: assignRows.map(row => {
                const ridee = rideeInfoMap.current[row.ridee];
                const rider = riderInfoMap.current[row.rider];

                return {
                    ridee: ridee.NAME,
                    rideeID: row.ridee,
                    rideeAddress: row.rideeAddress || ridee.ADDRESS,
                    rider: rider.NAME,
                    riderID: row.rider,
                    riderAddress: row.riderAddress || rider.ADDRESS,
                    day: row.day,
                    date: row.date,
                    type: row.type,
                    queueID: activeQueue.current.ID
                };
            })
        }
    };

    const raiseError = (errorMessage) => {
        setErrors(errors => errors.concat(errorMessage));
    };

    const mapForReport = () => {
        function getRideeRiderName(user, infoMap) {
            if (Number.isInteger(user)) {
                return infoMap[user].NAME;
            }
            if (infoMap[parseInt(user)]) {
                return infoMap[parseInt(user)].NAME;
            }
            return user;
        }

        function formatLeaderName(leader) {
            if (leader === "새가족") {
                return leader;
            }
            return leader && leader.length ?
                leader.substr(leader.length - 2) : '';
        }

        function formatDate(date) {
            const splitDate = date.split('-');
            return `${+splitDate[1]}/${+splitDate[2]}`
        }

        const dayMap = new Map();
        const mapData = {days: []};
        assignRows.forEach((originalRow) =>
            {
                const row = { ...originalRow };
                row.day = Constants.DayRef[row.day];
                // row.type = Constants.RideTypes[row.type];
                row.ridee = getRideeRiderName(row.ridee, rideeInfoMap.current);
                row.rider = getRideeRiderName(row.rider, riderInfoMap.current);
                row.rideeLeader = formatLeaderName(row.rideeLeader);
                row.riderLeader = formatLeaderName(row.riderLeader);
                row.date = formatDate(row.date);
                const { day, date, ...rest } = row;
                if (!dayMap.get(day)) {
                    const { type, ...assignment } = rest;
                    const pushData =
                        {
                            day: day,
                            date: date,
                            types:
                                [{
                                    type: type,
                                    assignment: [assignment]
                                }]
                        };

                    const typeSet = new Set();
                    mapData.days.push(pushData);
                    typeSet.add(type);
                    dayMap.set(day, typeSet);
                } else {
                    const typeSet = dayMap.get(day);
                    const dayData = mapData.days.find(d => d.day === day);
                    const { type, ...assignment } = rest;

                    if(typeSet.has(type)) {
                        const typeData = dayData.types.find(t => t.type === type);
                        typeData.assignment.push(assignment);
                    } else {
                        const pushData = {
                            type: type,
                            assignment: [ assignment ]
                        };
                        dayData.types.push(pushData);
                        typeSet.add(type);
                    }
                }
            }
        );
        return mapData;
    };

    return (
        <div>
            <h2>Assign</h2>
            {!loading &&
            <div id="canvas-container">
                {pageRef[page] === 'assignment' &&
                (<div>
                    {assignmentComplete ?
                        <h3>Assignment complete for week of {activeQueue.current ? helper.dayInLocalStringFormat(activeQueue.current.START_DATE) : ''} </h3> :
                        <h3>Make assignments for week of {activeQueue.current ? helper.dayInLocalStringFormat(activeQueue.current.START_DATE) : ''}</h3>}
                        <div>
                            {!!assignRows.length &&
                            <table>
                                <thead>
                                <tr>
                                    <th>Date</th>
                                    <th>Day</th>
                                    <th>Type</th>
                                    <th>Ridee</th>
                                    <th>Address</th>
                                    <th>Phone Number</th>
                                    <th>Leader</th>
                                    <th>Rider</th>
                                </tr>
                                </thead>
                                <tbody>
                                {assignRows.map((row, index) => {
                                    const staticData = {
                                        'key': index,
                                        'daysTypes': daysTypesAllowed,
                                        'riders': availableRiders,
                                        'ridees': ridesNeeded
                                    };
                                    return <AssignRow
                                        staticData={staticData}
                                        rowData={row}
                                        handleChange={handleChange}
                                        deleteRow={deleteRow}/>
                                })}
                                </tbody>
                            </table>}
                        </div>
                        <div>
                            <button onClick={addRow}>Add Row</button>
                        </div>
                    </div>
                )}

                {pageRef[page] === 'report' &&
                <React.Fragment>
                    <AssignReport data={reportData}/>
                    <div>
                        <button onClick={saveReport}>Save Report</button>
                    </div>
                </React.Fragment>
                }
            </div>}
            {loading && <div>Loading...</div>}
            {!!errors.length &&
            <div>
                <p>Error: {errors.map(error => <div>{error}</div>)}</p>
            </div>}
            <div>
                <div>
                    <button onClick={createReport}>Create Report</button>
                    <button onClick={completeAssignment}>{saving ? 'Saving...' : 'Complete Assignment'}</button>
                </div>
            </div>
        </div>
    );
};

const AssignRow = (props) => {
    const rowData = props.rowData;
    const staticData = props.staticData;
    const rowKey = staticData.key;
    const daysTypes = staticData.daysTypes;
    const types = rowData.day ? daysTypes.find(d => d.day_id == rowData.day).types : [];
    const ridees = staticData.ridees;
    const riders = staticData.riders;
    const handleChange = props.handleChange;

    const manualRideeInput = rowData.manualRideeInput || false;
    const manualRiderInput = rowData.manualRiderInput || false;

    return(
        <tr key={rowKey}>
            <td>
                <input type="date" value={rowData.date} />
            </td>
            <td>
                <select name="day" value={rowData.day} onChange={e => handleChange(rowKey, e)}>
                    <option key="default" value=""> </option>
                    {daysTypes.map(day => <option key={day.day_id} value={day.day_id}>{Constants.DayRef[day.day_id]}</option>)}
                </select>
            </td>
            <td>
                <select name="type" value={rowData.type} onChange={e => handleChange(rowKey, e)}>
                    <option key="default" value=""> </option>
                {(rowData.day && types) ?
                    types.map(type => <option key={type.id} value={type.type_id}>{Constants.RideTypes[type.type_id]}</option>) :
                    <option>Choose a day first</option>
                }
                </select>
            </td>
            <td>
            {manualRideeInput ?
                <input name="ridee-input" type="text" value={rowData.ridee} onChange={e => handleChange(rowKey, e)} /> :
                <select name="ridee-select" value={rowData.ridee} onChange={e => handleChange(rowKey, e)}>
                    <option key="default" value=""> </option>
                {!!(rowData.day && rowData.type && ridees[rowData.day]) &&
                    (ridees[rowData.day][rowData.type] || []).map(ridee =>
                    <option key={ridee.id} value={ridee.id}>{ridee.name}</option>)}
                    <option key="custom" value="custom">Add a name</option>
                </select>
            }
            </td>
            <td>
                <input name="rideeAddress" type="text" value={rowData.rideeAddress} onChange={e => handleChange(rowKey, e)} />
            </td>
            <td>
                <input name="tel" type="tel" value={rowData.tel} onChange={e => handleChange(rowKey, e)} />
            </td>
            <td>
                <input name="rideeLeader" type="text" value={rowData.rideeLeader} onChange={e => handleChange(rowKey, e)} />
            </td>
            <td>
            {manualRiderInput ?
                <input name="rider-input" type="text" value={rowData.rider} onChange={e => handleChange(rowKey, e)}/> :
                <select name="rider-select" value={rowData.rider} onChange={e => handleChange(rowKey, e)}>
                    <option key="default" value="-1"> </option>
                {!!(rowData.day && rowData.type && riders[rowData.day]) &&
                    riders[rowData.day][rowData.type].map(rider =>
                    <option key={rider.id} value={rider.id}>{rider.name}</option>)}
                    <option key="custom" value="custom">Add a name</option>
                </select>
            }
            </td>
            <td>
                <button onClick={props.deleteRow}>Delete</button>
            </td>
        </tr>
    )
};

export default Assign;