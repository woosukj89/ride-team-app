import React from 'react';
import DateSelectMulti from "./DateSelectMulti";
import { Constants } from "./properties";
import userService from "./service/UserService";
import utilityService from "./service/utilityService";
import { DateUtils } from "react-day-picker";
import NewWindow from "react-new-window";
import AssignReport from "./AssignReport";
import html2canvas from "html2canvas";

class Assign extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            page: 0,
            rowIndex: 0,
            assignRows: [],
            days: [],
            allRiders: [],
            allRidees: [],
            selectedRiders: [''],
            selectedRidees: [''],
            selectedDayIndex: 0,
            selectedTypeIndex: 0,
            reportWindowOpen: false,
        };

        this.pageRef = {
            0: 'selectDays',
            1: 'selectRidees',
            2: 'selectRiders',
            3: 'assignment',
            4: 'report'
        };
        this.reportData = null;
        this.rideeLeaderMap = null;
        this.riderLeaderMap = null;

        this.newRiderRef = React.createRef();
        this.handleDateSelect = this.handleDateSelect.bind(this);
        this.selectRidee = this.selectRidee.bind(this);
        this.selectRider = this.selectRider.bind(this);
        this.addToAllRiders = this.addToAllRiders.bind(this);
        this.addRow = this.addRow.bind(this);
        this.deleteRow = this.deleteRow.bind(this);
        this.moveBack = this.moveBack.bind(this);
        this.moveNext = this.moveNext.bind(this);
        this.handleChange = this.handleChange.bind(this);
        this.createReport = this.createReport.bind(this);
        this.saveAssignment = this.saveAssignment.bind(this);
        this.closeWindow = this.closeWindow(this);
        this.saveReport = this.saveReport.bind(this);
        this.mapForReport = this.mapForReport.bind(this);
    }

    componentDidMount() {
        userService.getRiders().then(riders => {
            this.setState({
                allRiders: riders.data
            });
            this.riderLeaderMap = new Map(riders.data.map(rider => [rider.NAME, rider.LEADER]));
        });
        userService.getRidees().then(ridees => {
            this.setState({
                allRidees: ridees.data
            });
            this.rideeLeaderMap = new Map(ridees.data.map(ridee => [ridee.NAME, ridee.LEADER]));
        });
    }

    handleDateSelect(day, { selected }) {
        const { days } = this.state;
        if (selected) {
            const selectedIndex = days.findIndex(selectedDay =>
                DateUtils.isSameDay(selectedDay.day, day)
            );
            days.splice(selectedIndex, 1);
        } else {
            days.push(
                {
                    day: day,
                    weekDay: Constants.DayRef[day.getDay()]
                });
        }
        this.setState({ days })
    }

    selectRider(event) {
        const riderName = event.target.value;
        const findIndex = this.state.selectedRiders.findIndex(selected => selected === riderName);
        const { selectedRiders } = this.state;
        if (findIndex < 0) {
            this.setState({
                selectedRiders: [...selectedRiders, riderName]
            });
        } else {
            selectedRiders.splice(findIndex, 1);
            this.setState({ selectedRiders })
        }
    }

    selectRidee(event) {
        const rideeName = event.target.value;
        const { selectedRidees } = this.state;
        const findIndex = selectedRidees.findIndex(selected => selected === rideeName);
        if (findIndex < 0) {
            this.setState({
                selectedRidees: [...selectedRidees, rideeName]
            });
        } else {
            selectedRidees.splice(findIndex, 1);
            this.setState({ selectedRidees });
        }
    }

    addToAllRiders() {
        const customRider = {
            ID: this.state.allRiders.length + 1,
            NAME: this.newRiderRef.current.value
        };
        const allRiders = [...this.state.allRiders, customRider];
        this.setState({ allRiders })
    }

    addRow(event) {
        const newRow = {
            key: this.state.rowIndex,
            day: this.state.days[this.state.selectedDayIndex].weekDay,
            ridee: '',
            address: '',
            tel: '',
            rider: '',
            leader: '',
            type: Constants.RideTypes[this.state.selectedTypeIndex],
            date: this.formatDate(this.state.days[this.state.selectedDayIndex].day)
        };
        const assignRows = this.state.assignRows.concat(newRow);
        this.setState({
            assignRows: assignRows,
            rowIndex: this.state.rowIndex + 1
        });
    }

    deleteRow() {
        const { assignRows } = this.state;
        assignRows.pop();
        this.setState({ assignRows });
    }

    handleChange(id, event) {
        const target = event.target;
        const value = target.value;
        const name = target.name;
        const newValues = {[name]: value};

        if (name === 'ridee') {
            const rideeInfo = this.state.allRidees.filter(ridee => ridee.NAME === value)[0];
            newValues['address'] = rideeInfo.ADDRESS;
            newValues['tel'] = rideeInfo.PHONE_NUMBER;
            newValues['leader'] = rideeInfo.LEADER;
        }

        if (name === 'day') {
            const selectedDayIndex = target.options.selectedIndex;
            newValues['date'] = this.formatDate(this.state.days[selectedDayIndex].day);
            this.setState({ selectedDayIndex });
        }

        if (name === 'type') {
            const selectedTypeIndex = target.options.selectedIndex;
            this.setState({ selectedTypeIndex });
        }

        this.setState({
            assignRows: this.state.assignRows.map(row => row.key === id ? {...row, ...newValues} : row)
        });
    }

    moveBack(event) {
        const currentPage = this.state.page;
        this.setState(
            {page: currentPage >= 1 ? currentPage - 1 : 0}
        );
    }

    moveNext(event) {
        const currentPage = this.state.page;
        this.setState(
            {page: currentPage < 4 ? currentPage + 1 : 4}
        );
    }

    createReport() {
        this.setState({
            reportData: this.mapForReport(),
            // reportWindowOpen: true
        });
        this.moveNext();
    }

    saveAssignment(event) {
        const data = this.mapData();
        utilityService.insertHistory(data).then(res => console.log(res))
    }

    mapData() {
        return {
            data: this.state.assignRows.map(row => (
                {
                    ridee: row.ridee,
                    rider: row.rider,
                    day: row.day,
                    date: row.date,
                    type: row.type,
                }
            ))
        }
    }

    mapForReport() {
        const rideeLeaderMap = this.rideeLeaderMap;
        const riderLeaderMap = this.riderLeaderMap;
        function getRideeLeader(ridee) {
            const leader = rideeLeaderMap.get(ridee) || "";
            return leader.length && leader.length === 2 ?
                leader.substr(1, 1) : leader.substr(1, 2);
        }
        function getRiderLeader(rider) {
            const leader = riderLeaderMap.get(rider);
            return leader.length === 2 ? leader.substr(1, 1) : leader.substr(1, 2);
        }
        function getTypeIndex(type) {
            return Constants.RideTypes.indexOf(type);
        }
        function formatDate(date) {
            const splitDate = date.split('-');
            return `${+splitDate[1]}/${+splitDate[2]}`
        }
        const dayMap = new Map();
        const mapData = {days: []};
        this.state.assignRows.forEach((originalRow) =>
            {
                const row = { ...originalRow };
                row.rideeLeader = getRideeLeader(row.ridee);
                row.riderLeader = getRiderLeader(row.rider);
                row.type = getTypeIndex(row.type);
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
    }

    closeWindow() {
        this.setState({
            reportWindowOpen: false
        });
    }

    saveReport() {
        const report = document.getElementById("assignment-report");
        // const clone = report.cloneNode(true);
        // const cloneStyle = clone.style;
        // cloneStyle.position = 'relative';
        // cloneStyle.top = report.offsetHeight + 'px';
        // cloneStyle.left = 0;
        // document.body.appendChild(clone);

        // const rect = report.getBoundingClientRect();
        // const pos = {x: rect.left, y: rect.top};
        // console.log(pos);
        // html2canvas(document.querySelector("#assignment-report"), { x: pos.x, y: -pos.y, height: report.offsetHeight })
        window.scrollTo(0, 0);
        // html2canvas(report, { scrollY: 0, windowWidth: report.offsetWidth, windowLength: report.offsetHeight })
        html2canvas(report)
            .then(function(canvas) {
                const dataURL = canvas.toDataURL("jpeg");
                const report = window.open();
                report.document.write('<iframe src="' + dataURL + '" frameborder="0" style="border:0; top:0; left:0; bottom: 0; height:100%; width: 100%"></iframe>')
            });
    }

    formatDate(date) {
        const d = new Date(date);
        let month = '' + (d.getMonth() + 1);
        let day = '' + d.getDate();
        const year = d.getFullYear();

        if (month.length < 2)
            month = '0' + month;
        if (day.length < 2)
            day = '0' + day;

        return [year, month, day].join('-');
    }

    render() {
        return (
            <div>
                <h2>Assign</h2>
                <div id="canvas-container">
                    {this.pageRef[this.state.page] === 'selectDays' &&
                    (<div>
                        <h3>For Which Days?</h3>
                        <p>Pick the days:</p>
                        <DateSelectMulti selectedDays={this.state.days.map(day => day.day)} handleDayClick={this.handleDateSelect} />
                    </div>)
                    }
                    {this.pageRef[this.state.page] === 'assignment' &&
                    (<div>
                        <h3>Make the Assignments</h3>
                        <div>
                            {this.state.assignRows &&
                            <table>
                                <thead>
                                    <tr>
                                        <th>Day</th>
                                        <th>Ridee</th>
                                        <th>Address</th>
                                        <th>Phone Number</th>
                                        <th>Rider</th>
                                        <th>Leader</th>
                                        <th>Type</th>
                                    </tr>
                                </thead>
                                <tbody>
                                {this.state.assignRows.map((row) => {
                                    const listData = {
                                        'days': this.state.days,
                                        'riders': this.state.selectedRiders,
                                        'ridees': this.state.selectedRidees
                                    };
                                    return <AssignRow
                                        listData={listData}
                                        rowData={row}
                                        handleChange={this.handleChange}/>
                                })}
                                </tbody>
                            </table>}
                        </div>
                        <div>
                            <button onClick={this.addRow}>Add Row</button>
                            <button onClick={this.deleteRow}>Delete Row</button>
                        </div>
                    </div>
                    )}

                    {this.pageRef[this.state.page] === 'selectRidees' &&
                    (<div>
                        <h3>Who Needs A Ride?</h3>
                        {this.state.allRidees.map(ridee =>
                            <div>
                            <input
                                id={"ridee" + ridee.ID} type="checkbox"
                                key={ridee.ID} onChange={this.selectRidee}
                                checked={this.state.selectedRidees.includes(ridee.NAME)}
                                value={ridee.NAME}/>
                            <label htmlFor={"rider" + ridee.ID}>{ridee.NAME}</label>
                            </div>)}
                    </div>)}

                    {this.pageRef[this.state.page] === 'selectRiders' &&
                    (<div>
                        <h3>Who Can Give Rides?</h3>
                        {this.state.allRiders.map(rider =>
                            <div>
                            <input
                                id={"rider" + rider.ID} type="checkbox"
                                key={rider.ID} onChange={this.selectRider}
                                checked={this.state.selectedRiders.includes(rider.NAME)}
                                value={rider.NAME}/>
                            <label htmlFor={"rider" + rider.ID}>{rider.NAME}</label>
                            </div>)}
                        <label>Add a Rider:
                            <input type="text" ref={this.newRiderRef}/>
                            <button onClick={this.addToAllRiders}>Add</button>
                        </label>
                    </div>)}

                    {this.pageRef[this.state.page] === 'report' &&
                    <React.Fragment>
                        <AssignReport data={this.state.reportData}/>
                        <div>
                            <button onClick={this.saveReport}>Save Report</button>
                        </div>
                    </React.Fragment>
                    }
                </div>
                <div>
                    {this.state.page >= 1 && <button onClick={this.moveBack}>Back</button>}
                    {this.state.page < 3 && <button onClick={this.moveNext}>Next</button>}
                    {this.state.page === 3 &&
                    <div>
                        <button onClick={this.createReport}>Create Report</button>
                        <button onClick={this.saveAssignment}>Save</button>
                    </div>}
                </div>
                }
                {/*{this.state.reportWindowOpen &&*/}
                {/*<NewWindow onUnload={this.closeWindow}>*/}
                {/*    <AssignReport data={this.state.reportData} />*/}
                {/*    <button onClick={this.saveReport}>Save</button>*/}
                {/*</NewWindow>}*/}
            </div>
        );
    }
}

export default Assign;

function AssignRow(props) {
    const rowData = props.rowData;
    const rowKey = rowData.key;
    const days = props.listData.days;
    const ridees = props.listData.ridees;
    const riders = props.listData.riders;
    const types = Constants.RideTypes;
    const handleChange = props.handleChange;

    return(
        <tr key={rowKey}>
            <td>
                <select name="day" value={rowData.day} onChange={e => handleChange(rowKey, e)}>
                    {days.map(day => <option>{day.weekDay}</option>)}
                </select>
            </td>
            <td>
                <select name="ridee" value={rowData.ridee} onChange={e => handleChange(rowKey, e)}>
                    {ridees.map(ridee => <option>{ridee}</option>)}
                </select>
            </td>
            <td>
                {rowData.address}
            </td>
            <td>
                {rowData.tel}
            </td>
            <td>
                <select name="rider" value={rowData.rider} onChange={e => handleChange(rowKey, e)}>
                    {riders.map(rider => <option>{rider}</option>)}
                </select>
            </td>
            <td>
                {rowData.leader}
            </td>
            <td>
                <select name="type" value={rowData.type} onChange={e => handleChange(rowKey, e)}>
                    {types.map(type => <option>{type}</option>)}
                </select>
            </td>
        </tr>
    )
}