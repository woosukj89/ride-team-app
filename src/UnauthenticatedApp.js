import React from "react";
import { Switch, Route, Redirect, BrowserRouter as Router } from "react-router-dom";
import LoginPage from "./LoginPage";
import { RegisterNewUser, ChooseType } from "./RegisterNewUser";

class UnauthenticatedApp extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            phone_number: "",
            loginError: null,
        };
        this.onChange = this.onChange.bind(this);
        this.onSubmit = this.onSubmit.bind(this);
    }

    onChange(event) {
        const phone_number = this.formatPhoneNumber(event.target.value, this.state.phone_number);
        this.setState({phone_number});
    }

    onSubmit() {
        this.props.login({phone_number: this.state.phone_number}).then(res => {
            if (!res.success) {
                this.setState({
                    loginError: res.error
                })
            }
        });
    }

    register() {

    }

    formatPhoneNumber(currTel, prevTel) {
        const tel = currTel.replace(/[^\d]/g, '');
        if(!tel) return tel;

        if (!prevTel || tel.length > prevTel.length) {
            if(tel.length < 4) return tel;
            if(tel.length < 7) return `(${tel.slice(0,3)}) ${tel.slice(3)}`;
            return `(${tel.slice(0,3)}) ${tel.slice(3,6)}-${tel.slice(6, 10)}`;
        }
    }

    render() {
        return (
            <Router>
                <Switch>
                    <Route path="/login" exact>
                        <LoginPage
                            phone_number={this.state.phone_number}
                            handleChange={this.onChange}
                            handleSubmit={this.onSubmit}
                            error={this.state.loginError} />
                    </Route>
                    <Route path="/register/rider">
                        <RegisterNewUser userType="rider"/>
                    </Route>
                    <Route path="/register/ridee">
                        <RegisterNewUser userType="ridee"/>
                    </Route>
                    <Route path="/register/choose-type">
                        <ChooseType/>
                    </Route>
                    <Redirect to="/login" />
                </Switch>
            </Router>

        )
    }
}

export default UnauthenticatedApp;