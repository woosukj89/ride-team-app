import React from "react";
import authClient from '../authentication/auth-client'
import userService from "../service/UserService";
import responseMapper from "../mapper/responseMapper";


const UserContext = React.createContext();

class UserProvider extends React.Component {
    constructor(props) {
        super(props);

        this.login = form => userService.login(form).then((res) => {
            if (res.message === "success") {
                if (!res.data) {
                    return {"success": false, "error": "Sorry. No user available with that number."}
                }
                const user = responseMapper.mapLoginData(res.data);
                this.setState({
                    user: {
                        id: user.id,
                        role: user.role,
                        username: user.username
                    }
                });
                authClient.setToken(user);
                return {"success": true};
            } else {
                return {"success": false, "error": res.error};
            }
        });
        this.logout = form => authClient.logout().then(() => {
            this.setState({
                user: { id: null, role: null, username: null }
            });
            authClient.logout();
        });
        this.register = form => authClient.register().then((newUser) => {
            this.setState({
                user: {
                    id: newUser.id,
                    role: newUser.role,
                    username: newUser.username
                }
            })
        });

        this.state = {
            user: authClient.getUser(),
            login: this.login,
            logout: this.logout,
            register: this.register
        };
    }

    render() {
        return (
            <UserContext.Provider value={this.state}>
                {this.props.children}
            </UserContext.Provider>
        )
    }
}

export {UserContext, UserProvider}