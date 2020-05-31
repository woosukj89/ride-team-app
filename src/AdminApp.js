import React from 'react';
import './App.css';
import {
    BrowserRouter as Router,
    Switch,
    Route,
    Link,
    withRouter
} from "react-router-dom";
import About from './About';
import Riders from './Riders';
import Ridees from './Ridees';
import Assign from './Assign';
import Report from './Report';
import PersonForm from './PersonForm';
import History from "./History";
import RideDetail from "./RideDetail";
import AdminQueue from "./AdminQueue";
import EditQueue from "./EditQueue";
import DayTypeSelect from "./DayTypeSelect";

function AdminApp(props) {
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
                                    <Link to="/riders">Riders</Link>
                                </li>
                                <li>
                                    <Link to="/ridees">Ridees</Link>
                                </li>
                                <li>
                                    <Link to="/queue">Queue</Link>
                                </li>
                                <li>
                                    <Link to="/assign">Assign</Link>
                                </li>
                                <li>
                                    <Link to="/history">Ride History</Link>
                                </li>
                                <li>
                                    <Link to="/report">Report</Link>
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
                        <Route path="/about">
                            <About />
                        </Route>
                        <Route path="/agreements" />
                        <Route path="/riders/rider/new">
                            <PersonForm type='rider' mode='new' />
                        </Route>
                        <Route path="/riders/rider/:riderID"
                               component={(props) =>
                                   <PersonForm type='rider' mode='edit' id={props.match.params.riderID} />} />
                        <Route path="/riders" component={Riders}/>
                        <Route path="/ridees/ridee/new">
                            <PersonForm type='ridee' mode='new' />
                        </Route>
                        <Route path="/ridees/ridee/:rideeID"
                               component={(props) =>
                                   <PersonForm type='ridee' mode='edit' id={props.match.params.rideeID} />} />
                        <Route path="/ridees" component={Ridees}/>
                        <Route path="/queue/availability/:queueID/:riderID" component={props =>
                            <DayTypeSelect userID={props.match.params.riderID}
                                           userType="rider"
                                           queueID={props.match.params.queueID} /> }>
                        </Route>
                        <Route path="/queue/ride-request/:rideeID">

                        </Route>
                        <Route path="/queue" component={AdminQueue}/>
                        <Route path="/editQueue" component={EditQueue} />
                        <Route path="/assign" component={Assign}/>
                        <Route path="/history">
                            <History userID={props.userID} role="admin" />
                        </Route>
                        <Route path="/ride-detail/:recordID">
                            <RideDetail role="admin"
                                        status="history"/>
                        </Route>
                        <Route path="/report" component={Report}/>
                        <Route path="/settings" />

                        <Route path="/" render={() => (<h2>Home</h2>)}/>
                    </Switch>
                </div>
            </section>
        </Router>

    );
}

export default AdminApp;