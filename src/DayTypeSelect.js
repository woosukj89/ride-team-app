import React from 'react';
import userService from './service/UserService'

class DayTypeSelect extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            selected: {},
            daysAllowed: [],
            queue: null,
            daysRef: {},
            typesRef: {}
        };
        this.initialState = null;
        this.handleTypeChange = this.handleTypeChange.bind(this);
        this.saveChanges = this.saveChanges.bind(this);
    }

    componentDidMount() {
        const today = new Date();
        const date = [today.getFullYear(),
            String(today.getMonth() + 1).padStart(2, "0"),
            String(today.getDate()).padStart(2, "0")].join("-");

        userService.getCurrentQueue(date).then(res => {
            this.setState({
                queue: res.data
            });
            this.getDaysAllowed(res.ID);
        });
        userService.getDaysRef().then(res => {
            this.setState({
                daysRef: res.data.reduce((days, day) => { return {...days, [day.ID]: day.DAY}}, {})
            })
        });
        userService.getTypesRef().then(res => {
            this.setState({
                typesRef: res.data.reduce((types, type) => { return {...types, [type.KEY]: type.RIDE_TYPE}}, {})
            })
        });

    }

    getDaysAllowed(queueID) {
        userService.getDaysAllowed().then(res => {
            const data = res.data;
            this.setState({
                daysAllowed: data
            });
            const params = { queueID: queueID };
            if (this.props.id) { params["id"] = this.props.id }
            if (this.props.userType === "rider") {
                this.getCurrentState(data, userService.getRideAvailability, params);
            }
            else if (this.props.userType === "ridee") {
                this.getCurrentState(data, userService.getRideNeeded, params);
            }
        });
    }

    getCurrentState(daysAllowed, callerFunction, params) {
        const selectedState = { };
        for (let day of daysAllowed) {
            for (let type of day.types) {
                selectedState[type.id] = { day: day, type: type, selected: false };
            }
        }
        callerFunction(params).then(res => {
            const result = res || [];
            for (let dayType in result) {
                selectedState[dayType.dayTypeID].selected = true;
            }
            this.initialState = selectedState;
            this.setState({
                selected: selectedState
            })
        })
    }

    checkState(day, type) {
        const selected = this.state.selected;
        return selected[day] && selected[day][type];
    }

    handleTypeChange(day, type, event) {
        const { selected } = this.state;
        const selectedDay = selected[day] || {};
        selectedDay[type] = event.target.checked;
        selected[day] = selectedDay;
        this.setState({ selected })
    }

    saveChanges() {
        const data = {
            queueID: this.state.queue.ID,
            data: this.convertSelectedToArray(this.state.selected)
        };
        // if (this.props.userType === "rider") {
        //     userService.saveRiderAvailability(this.props.id, data).then();
        // }
        // else if (this.props.userType === "ridee") {
        //     userService.saveRideRequest(this.props.id, data).then();
        // }
        userService.saveRiderAvailability(1, data).then(console.log);
        userService.saveRideRequest(2, data).then(console.log);

    }

    convertSelectedToArray(selectedObj) {
        console.log(selectedObj);
        const result = [];
        for (let day in selectedObj) {
            for (let type in selectedObj[day]) {
                console.log(type);
                if (selectedObj[day][type]) {
                    result.push({day: day, type: type});
                }
            }
        }

        return result;
    }

    render() {
        return (
            <div>
                <div>
                    <div>
                        Select Day:
                    </div>
                    <div>
                        {this.state.daysAllowed.map(day => (
                            <div>
                                <div>{this.state.daysRef[day.day_id]}</div>
                                {
                                    day.types.map(type => (
                                        <div>
                                            <label>
                                                <input key={type.id}
                                                       type="checkbox"
                                                       checked={this.checkState(day.day_id, type.type_id) || false}
                                                       onChange={ev => this.handleTypeChange(day.day_id, type.type_id, ev)}
                                                />
                                                {this.state.typesRef[type.type_id]}
                                            </label>
                                        </div>))
                                }
                            </div>
                        ))}
                    </div>
                    <div>
                        <button onClick={this.saveChanges}>Save</button>
                    </div>
                </div>
            </div>
        );
    }
}

export default DayTypeSelect