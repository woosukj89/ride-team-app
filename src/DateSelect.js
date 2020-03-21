import React from 'react';
import DayPickerInput, { DateUtils } from 'react-day-picker';
import DayPicker from 'react-day-picker';
import 'react-day-picker/lib/style.css';

class DateSelect extends React.Component {
    constructor(props) {
        super(props);
        if (this.props.mode === 'single') {
            this.state = {
                selectedDay: null,
            };
        }
        else if (this.props.mode === 'multi') {
            this.state = {
                selectedDays: [],
            }
        }
        this.handleDayClick = this.handleDayClick.bind(this);
    }

    handleDayClick(day, { selected }) {
        if (this.props.mode === 'single') {
            this.setState({
                selectedDay: selected ? undefined : day,
            });
        }
        else if (this.props.mode === 'multi') {
            const { selectedDays } = this.state;
            if (selected) {
                const selectedIndex = selectedDays.findIndex(selectedDay =>
                    DateUtils.isSameDay(selectedDay, day)
                );
                selectedDays.splice(selectedIndex, 1);
            } else {
                selectedDays.push(day);
            }
            this.setState({ selectedDays })
        }
    }

    render() {
        const selectedDay = this.props.mode === 'single' ? this.state.selectedDay :
            this.props.mode ==='multi' ? this.state.selectedDays : null;
        return (
            this.props.mode === 'single' ?
                <DayPickerInput
                    value={selectedDay}
                    onDayChange={this.handleDayClick}
                    dayPickerProps={{
                        selectedDay: selectedDay
                    }}
                /> :
            <React.Fragment>
            <div>{this.state.selectedDays.map(day => day.toLocaleString()).join(", ")}</div>
            <DayPicker
                selectedDays={this.state.selectedDays}
                onDayClick={this.handleDayClick}
            />
            </React.Fragment>
        )
    }
}

export default DateSelect