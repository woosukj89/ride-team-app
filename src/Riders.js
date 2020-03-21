import React from 'react';
import userService from './service/UserService'
import {
    Link
} from "react-router-dom";

class Riders extends React.Component {

    constructor(props) {
        super(props);
        this.state = {riders: []}
    }

    componentDidMount() {
        userService.getRiders().then(riders => {
            this.setState({
                riders: riders.data
            })
        })
    }

    render() {
        return (
            <div>
                <h2>Riders</h2>
                <div>
                    <table>
                        <thead>
                            <tr>
                                <th>Name</th>
                                <th>Address</th>
                                <th>Phone Number</th>
                                <th>Small Group</th>
                                <th>Birthday</th>
                                <th>Kakao</th>
                            </tr>
                        </thead>
                        <tbody>
                            {this.state.riders.map((rider) => TableRows(rider, this.props.match))}
                        </tbody>
                    </table>
                </div>
                <div>
                    <Link to={this.props.match.url + "/rider/new"}>
                        <button>Add</button>
                    </Link>
                </div>
            </div>

        );
    }
}

export default Riders

function TableRows(rider, match) {
    return (
        <tr key={rider.ID}>
            <td>{rider.NAME}</td>
            <td>{rider.ADDRESS}</td>
            <td>{rider.PHONE_NUMBER}</td>
            <td>{rider.LEADER}</td>
            <td>{rider.BIRTHDAY}</td>
            <td>{rider.KAKAO}</td>
            <td>
                <Link to={match.url + "/rider/" + rider.ID}>
                    <button>Edit</button>
                </Link>
            </td>
        </tr>
    );
}
