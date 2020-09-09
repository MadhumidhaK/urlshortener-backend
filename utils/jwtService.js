const path = require('path');
require('dotenv').config({
  path: path.join(__dirname, "../.env")
});
const jwt = require('jsonwebtoken');

const signOptions = {
    issuer: "url-shortener",
    expiresIn: "12h"
}

const jwtKey = process.env.JWT_KEY;
console.log(process.env.JWT_KEY)
exports.getToken = (payload) => {
    const token = jwt.sign(payload, jwtKey, signOptions);

    return token;
}

exports.verifyToken = (token) => {
    try {
        const jwtData = jwt.verify(token, jwtKey, signOptions);
        return jwtData;
    } catch (error) {
        console.log(error);
        return false;
    }
}