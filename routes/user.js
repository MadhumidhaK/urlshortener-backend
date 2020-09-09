const express = require('express');

const user = require('../controllers/user');
const isAuth = require('../middleware/is-auth');
const route = express.Router();

route.post("/signup", user.createUser);
route.post("/requestverifyemail", user.requestEmailVerification);
route.post("/verifyemail", user.emailVerification);
route.post("/login", user.login);
route.post("/forgotpassword", user.forgotPassword);
route.post("/resetpassword", user.resetPassword);
route.get("/logout", user.logout);
route.get("/verifytoken", isAuth ,user.isLoggedIn);


module.exports = route;
