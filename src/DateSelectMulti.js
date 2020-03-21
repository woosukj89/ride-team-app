import React from 'react';
import DayPicker, { DateUtils } from 'react-day-picker';
import 'react-day-picker/lib/style.css';

class DateSelectMulti extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <React.Fragment>
            <div>{this.props.selectedDays.map(day => day.toLocaleString()).join(", ")}</div>
            <DayPicker
                selectedDays={this.props.selectedDays}
                onDayClick={this.props.handleDayClick}
            />
            </React.Fragment>
        )
    }
}

export default DateSelectMulti