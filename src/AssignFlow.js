import React from "react";
import userService from "./service/UserService";
import { Switch, Route, withRouter } from 'react-router-dom';
import Assigned from "./Assigned";
import AssignmentDetail from "./AssignmentDetail";
import Queue from "./Queue";
import DayTypeSelect from "./DayTypeSelect";
import helper from "./service/helpers";

class AssignFlow extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            queueID: null,
            week: null,
            lastDay: null,
            assignmentDone: null
        };
    }

    componentDidMount() {
        userService.getQueue(helper.getDate(new Date())).then((queue) => {
            if (queue.data) {
                const data = queue.data;
                this.setState({
                    queueID: data.ID,
                    week: data.START_DATE,
                    lastDay: data.EXPIRE_DATE,
                    assignmentDone: data.ASSIGNMENT_COMPLETE
                });

                const routeHistory = this.props.history;
                if (data.ASSIGNMENT_COMPLETE) {
                   routeHistory.push("/assigned");
                } else {
                    routeHistory.push("/queue");
                }
            } else {
                console.log("no data", queue);
            }

        });
    }


    render() {

        const week = this.state.week;

        return (
            <div>
                {this.state.queueID ?
                <div>
                    <div>
                        {!!week && <h2>Week of {week}</h2>}
                    </div>
                    <div>
                        <Switch>
                            <Route path="/assigned">
                                <Assigned />
                            </Route>
                            <Route path="/assigned/assignmentDetail/rider/:riderID">
                                <AssignmentDetail userType="rider"/>
                            </Route>
                            <Route path="/assigned/assignmentDetail/ridee/:rideeID">
                                <AssignmentDetail userType="ridee"/>
                            </Route>
                            <Route exact path="/queue">
                                <Queue queueID={this.state.queueID}
                                       lastDay={this.state.lastDay}
                                       {...this.props}/>
                            </Route>
                            <Route path="/queue/availability/:queueID/:riderID">
                                <DayTypeSelect userID={this.props.userID} userType="rider" queueID={this.state.queueID} />
                            </Route>
                            <Route path="/queue/ride-request">
                                <DayTypeSelect userID={this.props.userID} userType="ridee" queueID={this.state.queueID} />
                            </Route>

                        </Switch>
                    </div>
                </div> :
                <div>
                    <p>Not Available.</p>
                </div>}
            </div>
        );
    }


}

export default withRouter(AssignFlow);