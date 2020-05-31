import {BrowserRouter as Router, Link, Redirect, Route, Switch} from "react-router-dom";
import About from "./About";
import AssignFlow from "./AssignFlow";
import PersonForm from "./PersonForm";
import Settings from "./Settings";
import React from "react";
import Queue from "./Queue";
import Assigned from "./Assigned";


function RideeApp(props) {
    console.log(props);
    return (
        <Router>
            <div>
                <header>
                    <div>
                        <div>
                            Ride Team Logo
                        </div>
                        <nav>
                            <ul>
                                <li>
                                    <Link to="/">Home</Link>
                                </li>
                                <li>
                                    <Link to="/about">About</Link>
                                </li>
                                <li>
                                    <Link to="/profile">Profile</Link>
                                </li>
                                <li>
                                    <Link to="/history">Ride History</Link>
                                </li>
                                <li>
                                    <Link to="/settings">Settings</Link>
                                </li>
                            </ul>
                        </nav>
                        <a href="/logout" onClick={props.logout}>Log Out</a>
                    </div>
                </header>
            </div>
            <section>
                <div>
                    <Switch>
                        <Route path="/">
                            <AssignFlow userID={props.userID} role="ridee" />
                        </Route>
                        <Route path="/about" component={About}/>
                        <Route path="/profile">
                            <PersonForm type='ridee' mode='edit' id={props.userID}/>
                        </Route>
                        <Route path="/settings" component={Settings}/>
                        {/*<Redirect to="/" />*/}
                    </Switch>
                </div>
            </section>
        </Router>
    )
}

export default RideeApp;