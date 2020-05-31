const jwt = require('jsonwebtoken');
const jwtKey = 'asdfagajukfkltyu;asdfj;';
const jwtRefreshKey = 'asdfagajukfkltyefetqwet';
const jwtExpiresOn = '1m';
const jwtRefreshExpiresOn = '7d';

const testUsers = [
    {
        username: 'user1',
        password: 'password1',
        role: 'rider',
        id: '2'
    },
    {
        username: 'user2',
        password: 'password2',
        role: 'ridee',
        id: '2'
    },
    {
        username: 'user3',
        password: 'password3',
        role: 'admin',
        id: '1'
    }
];

const createTokens = (role, userID, refreshToken) => {

    const token = jwt.sign({role, userID}, jwtKey, {
        algorithm: 'HS256',
        expiresIn: jwtExpiresOn
    });

};

const signIn = (req, res) => {
    const { phone_number } = req.body;
    const userInDB = getUser(phone_number);
    const { id, role } = userInDB;

    if (!phone_number || !id || !role) {
        return res.status(401).end();
    }

    const token = jwt.sign({ role, id }, jwtKey, {
        algorithm: 'HS256',
        expiresIn: jwtExpirySeconds
    });
    console.log(token);

    //TODO: send admin privileges as well
    res.cookie('token', token, { maxAge: jwtExpirySeconds * 1000 });
    res.end()
};

const verifyToken = (token, secretKey) => {
    try{
        return jwt.verify(token, secretKey);
    } catch (e) {
        console.log('error with token verify', e);
        return null;
    }
};

const isAuthenticated = (req, res, next) => {
    const token = req.headers['x-token'];
    const userData = verifyToken(token, jwtKey);
    if (userData) {
        return next(userData);
    } else {
        res.status(401).end;
    }
};

const welcome = (req, res) => {
    const token = req.cookies.token;

    if (!token) {
        return res.status(401).end;
    }

    let payload;
    try {
        payload = jwt.verify(token, jwtKey);
    } catch (e) {
        if (e instanceof jwt.JsonWebTokenError) {
            return res.status(401).end;
        }

        return res.status(400).end();
    }

    //TODO: return back with success status
    res.send(`Welcome ${payload.username}!`);
};

const createToken = (user, secretKey) => {

    return jwt.sign({ userID: user.userID, role: user.role }, jwtKey, {
        algorithm: 'HS256',
        expiresIn: jwtExpiresOn
    });
};

const createRefreshToken = (user, secretKey) => {
    return jwt.sign({ userID: user.userID, role: user.role }, jwt, {
        algorithm: 'HS256',
        expiresIn: jwtRefreshExpiresOn
    });
};

const refreshTokens = (token, refreshToken) => {

    const userData = verifyToken(token, jwtKey);
    const refreshTokenData = verifyToken(refreshToken, jwtRefreshKey);

    if (!userData || !refreshTokenData) {
        return { }
    }

    const newToken = createToken(userData, jwtKey);
    //check if refresh Token needs refresh
    const nowUnixSeconds = Math.round(Number(new Date()) / 1000);
    const newRefreshToken = Math.floor((payload.exp - nowUnixSeconds) / (60 * 60 * 24)) < 3 ?
        createRefreshToken(userData, jwtRefreshKey) : refreshToken;

    return {
        token: newToken,
        refreshToken: newRefreshToken
    };
};

const refresh = (req, res) => {
    //TODO: check header authorization instead of cookie
    const token = req.headers['x-token'];
    const refreshToken = req.headers['x-refresh-token'];

    if (!token) {
        return res.status(401).end();
    }

    let payload;
    try {
        payload = jwt.verify(token, jwtKey);
    } catch (e) {
        if (e instanceof jwt.JsonWebTokenError) {
            return res.status(401).end();
        }
        return res.status(400).end();
    }

    const nowUnixSeconds = Math.round(Number(new Date()) / 1000);
    // if (Math.floor((payload.exp - nowUnixSeconds) / (60 * 60 * 24) > ) {
    //     return res.status(400).end();
    // }

    const newToken = jwt.sign({ username: payload.username }, jwtKey, {
        algorithm: 'HS256',
        expiresIn: jwtExpiresOn
    });

    res.cookie('token', newToken, { maxAge: jwtExpiresOn * 1000 });
    res.end();
};