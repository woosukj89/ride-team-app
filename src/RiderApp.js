import {BrowserRouter as Router, Link, Route, Switch} from "react-router-dom";
import About from "./About";
import AssignFlow from "./AssignFlow";
import PersonForm from "./PersonForm";
import Riders from "./Riders";
import Ridees from "./Ridees";
import Settings from "./Settings";
import React from "react";


function RiderApp(props) {
    return (
        <Router>
            <div>
                <header>
                    <div>
                        <div>
                            Ride Team Logo
                        </div>
                        <div>
                            <p>{props.username}</p>
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
                                    <Link to="/riders">Riders</Link>
                                </li>
                                <li>
                                    <Link to="/ridees">Ridees</Link>
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
                            <AssignFlow userID={props.userID} role="rider" />
                        </Route>
                        <Route path="/about" component={About}/>
                        <Route path="/profile">
                            <PersonForm type='rider' mode='edit' id={props.userID}/>
                        </Route>
                        <Route path="/riders" component={Riders}/>
                        <Route path="/ridees" component={Ridees}/>
                        <Route path="/settings" component={Settings}/>
                    </Switch>
                </div>
            </section>
        </Router>
    )
}

export default RiderApp;