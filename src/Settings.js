import React from "react";
import {
    getInitialRiderNotificationsSettingsForm,
    getInitialRideeNotificationsSettingsForm,
    displayNameReference
} from "./form/SettingsForm";

class Settings extends React.Component {
    constructor(props) {
        super(props);

        let form;
        if (props.userType === "rider") {
            form = getInitialRiderNotificationsSettingsForm();
        }
        else if (props.userType === "ridee") {
            form = getInitialRideeNotificationsSettingsForm();
        }
        this.state = {
            form: form
        }
    }

    handleChange(event) {

    }

    render() {
        return (
            <div>
                <div>
                    <div>{this.props.userName}</div>
                </div>
                <div>
                    <div>Notifications</div>
                    <div>
                        {this.state.form.map(field => (
                            <div>
                                <label>{field.displayName}
                                    <input name={field} type="checkbox" onChange={this.handleChange} checked={field.active}/>
                                </label>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        )
    }
}

export default Settings;