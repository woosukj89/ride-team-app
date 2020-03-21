import React from "react";
// import RideTeamLogo from "assets/Ride Team Logo.jpg"
// import SechungLogo from "assets/Sechung Logo.jpg"

class AssignReport extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <div id="assignment-report">
                <header>
                    <div className="logo-div">
                        <img className="logo" src={require("./assets/Ride Team Logo.jpg")} alt="Ride Team Logo" />
                    </div>
                    <div className="verse-div font-MapoFlowerIsland">
                        <p className="verse-line">보내심을 받지 아니하였으면 어찌 전파하리요 <br />기록된 바 아름답도다 좋은 소식을 전하는<br />자들의 발이여 함과 같으니라</p>
                        <p className="verse-number">- 로마서 10:15</p>
                    </div>
                </header>
                {this.props.data.days.map(day =>
                    <section>
                        <div className="main-header font-TTTogether">{day.day} ({day.date})</div>
                        {day.types.map(type =>
                            <article id="test">
                                <div className="sub-header">{type.type ? "Return Home" : "To Church"}</div>
                                <div className="main-container font-BBTreeGR">
                                {type.assignment.map(assignment =>
                                    <div className="grid-container">
                                        <div className="grid-rider-container">
                                            {assignment.rider} ({assignment.riderLeader})
                                        </div>
                                        <div className="grid-ridee-container">
                                            <div className="grid-top-container">
                                                <div className="grid-ridee-middle-top">
                                                    -
                                                </div>
                                                <div className="grid-ridee-name-section">
                                                    {assignment.ridee} ({assignment.rideeLeader})
                                                </div>
                                                <div className="grid-ridee-phone-section">
                                                    {assignment.tel}
                                                </div>
                                            </div>
                                            <div className="grid-bottom-container">
                                                <div className="grid-ridee-middle-bottom">
                                                </div>
                                                <div className="grid-ridee-address-section">
                                                    {assignment.address}
                                                </div>
                                            </div>
                                        </div>
                                    </div>)
                                }
                                </div>
                            </article>)
                        }
                    </section>)
                }
                <footer>
                    <div className="footer-container">
                        <div className="footer-affiliation">
                            Semihan Church
                            <p>1615 W Belt Line Rd. Carrollton, TX 75006</p>
                        </div>
                        <div className="footer-logo-container">
                            <img className="footer-logo" src={require("./assets/Sechung Logo.jpg")} alt="Sechung Logo"/>
                        </div>
                    </div>
                </footer>
            </div>
        )
    }
}

export default AssignReport;