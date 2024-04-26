const jwt = require('jsonwebtoken');

const getToken = (payload) => {
    return jwt.sign({ 
        data: payload
    }, process.env.JWT_SECRET, { expiresIn: '1h' });
}

const getTokenData = (token) => {
    console.log("getTokenData", token);
    return new Promise((resolve, reject) => {
        jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
            if (err) {
                console.log(err);
                reject(err);
            } else {
                resolve(decoded);
            }
        });
    });
}

const generateRefreshToken = (payload) => {
    console.log("generateRefreshToken", payload);
    console.log("JWT_SECRET:", process.env.JWT_SECRET);
    return jwt.sign({ data: payload }, process.env.JWT_SECRET, { expiresIn: "3d" });
};

module.exports = {
    getToken,
    getTokenData,
    generateRefreshToken
};
