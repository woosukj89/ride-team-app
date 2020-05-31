import React from 'react';
import {Redirect} from 'react-router-dom'
import userService from './service/UserService'

class DayTypeSelect extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            selected: {},
            daysAllowed: [],
            daysRef: {},
            typesRef: {},
            saved: false,
            errorMessage: ''
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

        this.getDaysAllowed(this.props.queueID, this.props.userID);
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

    getDaysAllowed(queueID, userID) {
        userService.getDaysAllowed().then(res => {
            const data = res.data;
            this.setState({
                daysAllowed: data
            });
            const params = { queueID: queueID, userID: userID };
            if (this.props.userType === "rider") {
                this.getCurrentState(data, userService.getRideAvailability, params);
            }
            else if (this.props.userType === "ridee") {
                this.getCurrentState(data, userService.getRideNeeded, params);
            }
        });
    }

    getCurrentState(daysAllowed, callerFunction, params) {
        const selectedState = {};
        for (let day of daysAllowed) {
            selectedState[day.day_id] = {};
            for (let type of day.types) {
                selectedState[day.day_id][type.type_id] = false;
            }
        }
        callerFunction(params).then(res => {
            if (res.error) {
                this.handleErrorResponse(res.error);
                return;
            }
            const result = res.data || [];
            // for (let typeID in selectedState) {
            //     const dayType = selectedState[typeID];
            //     for (let row in res) {
            //         if (row.DAY === dayType.day && row.TYPE === dayType.type) {
            //             dayType.selected = true;
            //         }
            //     }
            // }
            for (let row of result) {
                if (selectedState[row.DAY]) {
                    selectedState[row.DAY][row.TYPE] = true;
                }
            }
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
        const userID = this.props.userID;
        const data = {
            queueID: this.props.queueID,
            data: this.convertSelectedToArray(this.state.selected)
        };
        if (this.props.userType === "rider") {
            userService.saveRiderAvailability(userID, data).then((res) => this.handleSaveResponse(res));
        }
        else if (this.props.userType === "ridee") {
            userService.saveRideRequest(userID, data).then((res) => this.handleSaveResponse(res));
        }
    }

    convertSelectedToArray(selectedObj) {
        const result = [];
        for (let day in selectedObj) {
            for (let type in selectedObj[day]) {
                if (selectedObj[day][type]) {
                    result.push({day: day, type: type});
                }
            }
        }

        return result;
    }

    handleSaveResponse(res) {
        if (res.error) {
            this.handleErrorResponse(res.error);
        } else if (res.message === "success") {
            this.setState({saved: true})
        }
    }

    handleErrorResponse(error) {
        const errorMessage = error;
        this.setState({errorMessage})
    }

    render() {
        if (this.state.saved) {
            console.log("Saved!");
            return <Redirect to="/queue" />
        }

        return (
            <div>
                <div>
                    <div>
                        {this.props.userType === "rider" ? <h2>I can give rides on:</h2> : <h2>I need rides for:</h2>}
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