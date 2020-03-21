import React from 'react';
import './App.css';
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link
} from "react-router-dom";
import About from './About';
import Riders from './Riders';
import Ridees from './Ridees';
import Assign from './Assign';
import Report from './Report';
import PersonForm from './PersonForm';
import AssignReport from "./AssignReport";

function App() {
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
                    <Link to="/about">About Us</Link>
                  </li>
                  <li>
                    <Link to="/riders">Riders</Link>
                  </li>
                  <li>
                    <Link to="/ridees">Ridees</Link>
                  </li>
                  <li>
                    <Link to="assign">Assign</Link>
                  </li>
                  <li>
                    <Link to="report">Report</Link>
                  </li>
                </ul>
              </nav>
            </div>
          </header>
        </div>
        <section>
          <div>
            <Switch>
              <Route path="/about">
                <About />
              </Route>
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
              <Route path="/assign" component={Assign}/>
              <Route path="/" render={() => (<h2>Home</h2>)}/>
              <Route path="/report" component={Report}/>
            </Switch>
          </div>
        </section>
        <Route path="/assignment/report" component={AssignReport} />
      </Router>

  );
}

export default App;