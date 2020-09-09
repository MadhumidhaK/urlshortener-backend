const { verifyToken } = require("../utils/jwtService");

module.exports = (req, res, next) => {
    console.log("Verifying token");
    console.log(req.header('Authorization'));
    console.log(req.get('authorization'))
    console.log(req.headers.authorization);
    // console.log(req.headers('Authorization'));
    // console.log(req.headers['Authorization']);
    const token = req.header('Authorization');
    const jwtData = verifyToken(token);
    if(jwtData){
        req.sessionUser = jwtData
    }
    next();
}