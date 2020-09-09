const express = require('express');

const url = require('../controllers/url');
const isAuth = require('../middleware/is-auth');
const route = express.Router();


route.post("/create", isAuth,url.createShortUrl);
// route.patch("/update/clicks", isAuth ,url.updateClicks);
route.get("/all", isAuth, url.getURLs);
route.get("/lastmonth", isAuth, url.getLastMonthURLs);
route.get("/lastweek", isAuth, url.getLastWeekURLs);
route.get("/date/:date", isAuth, url.getThisDateURLs);
route.patch("/update/name", isAuth, url.updateName);

module.exports = route;