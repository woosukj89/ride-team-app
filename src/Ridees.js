import React from 'react';
import userService from "./service/UserService";
import {Link} from "react-router-dom";

class Ridees extends React.Component {

    constructor(props) {
        super(props);
        this.state = {ridees: []}
    }

    componentDidMount() {
        userService.getRidees().then(ridees => {
            this.setState({
                ridees: ridees.data
            })
        })
    }

    render() {
        return (
            <div>
                <h2>Ridees</h2>
                <div>
                    <table>
                        <thead>
                        <tr>
                            <th>Name</th>
                            <th>Address</th>
                            <th>Phone Number</th>
                            <th>Small Group</th>
                            <th>Leader</th>
                            <th>Kakao</th>
                            <th>Location</th>
                            <th>Small Group</th>
                        </tr>
                        </thead>
                        <tbody>
                        {this.state.ridees.map((ridee) => TableRows(ridee, this.props.match))}
                        </tbody>
                    </table>
                </div>
                <div>
                    <Link to={this.props.match.url + "/ridee/new"}>
                        <button>Add</button>
                    </Link>
                </div>
            </div>

        );
    }
}

function TableRows(ridee, match) {
    return (
        <tr key={ridee.ID}>
            <td>{ridee.NAME}</td>
            <td>{ridee.ADDRESS}</td>
            <td>{ridee.PHONE_NUMBER}</td>
            <td>{ridee.LEADER}</td>
            <td>{ridee.KAKAO}</td>
            <td>{ridee.LOCATION}</td>
            <td>{ridee.SMALL_GROUP}</td>
            <td>
                <Link to={match.url + "/ridee/" + ridee.ID}>
                    <button>Edit</button>
                </Link>
            </td>
        </tr>
    );
}

export default Ridees