const localStorageKey = '__bookshelf_token__';

function handleUserResponse({user: {token, ...user}}) {
    window.localStorage.setItem(localStorageKey, token);
    return user;
}

function setToken(user) {
    console.log(user);
    window.localStorage.setItem(localStorageKey, JSON.stringify(user));
}

function getUser() {
    const token = getToken();
    if (!token) {
        return {id: null, role: null};
    }
    return JSON.parse(token);
}

// function login({username, password}) {
//     return client('login', {body: {username, password}}).then(handleUserResponse);
// }
//
// function register({username, password}) {
//     return client('register', {body: {username, password}}).then(
//         handleUserResponse,
//     );
// }

function logout() {
    window.localStorage.removeItem(localStorageKey);
}

function getToken() {
    return window.localStorage.getItem(localStorageKey);
}

const authClient = {
    logout: logout,
    getUser: getUser,
    setToken: setToken
};

export default authClient;
