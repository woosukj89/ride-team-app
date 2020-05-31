import React from 'react';
import './App.css';
import {UserContext, UserProvider} from "./context/user-context";
import AdminApp from "./AdminApp";
import RiderApp from "./RiderApp";
import RideeApp from "./RideeApp";
import UnauthenticatedApp from "./UnauthenticatedApp";

// const AdminApp = React.lazy(import('./AdminApp'));
// const RiderApp = React.lazy(import('./RiderApp'));
// const RideeApp = React.lazy(import('./RideeApp'));
// const UnauthenticatedApp = React.lazy(import('./UnauthenticatedApp'));

function App() {

  return (
      <UserProvider>
          <UserContext.Consumer>
              {({user, login, logout, register}) => {
                  const {id, role, username} = user;
                  switch (role) {
                      case 'admin':
                          return <AdminApp userID={id} username={username} logout={logout}/>;
                      case 'rider':
                          return <RiderApp userID={id} username={username} logout={logout}/>;
                      case 'ridee':
                          return <RideeApp userID={id} username={username} logout={logout}/>;
                      default:
                          return <UnauthenticatedApp login={login} register={register}/>;
                  }
              }}
          </UserContext.Consumer>
      </UserProvider>
  )
}

export default App;