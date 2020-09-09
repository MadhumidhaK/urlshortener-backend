var path = require('path');
require('dotenv').config({
  path: path.join(__dirname, "./.env")
});
var createError = require('http-errors');
var express = require('express');
var fs = require('fs');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
const compression = require('compression');
const helmet = require('helmet');
const cors = require("cors");

const db = require('./config/dbConfig');
var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
const userRouter = require("./routes/user");
const urlRouter = require("./routes/url");
const { getURL } = require('./controllers/url');

console.log(process.env.JWT_KEY)
var app = express();

app.use(helmet());

app.use(logger('dev'));
app.use(express.json());
const accessLogStream = fs.createWriteStream(path.join(__dirname, 'access.log'), { flags: 'a' })
app.use(logger('combined', { stream: accessLogStream }));
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(compression());
app.use(express.static(path.join(__dirname, 'public')));
app.set('views', path.join(__dirname, 'views'));
// app.use(cors());

app.use(function (req, res, next) {
  console.log("About to set headers");
  res.setHeader('Access-Control-Allow-Origin', req.headers.origin || "*");
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE,PATCH');
  res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
  res.setHeader('Access-Control-Allow-Credentials', true);
  console.log('Headers has been set');
  next();
});
console.log("received a request");
app.use('/', indexRouter);
app.use('/user', userRouter);
app.use('/url', urlRouter);
app.use('/users', usersRouter);
app.get("/:shortUrl", getURL)

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.statusCode || 500);
  if(err.statusCode === 500){
    err.message = "Internal Server Error. Please try again later.";
  }
  res.send({
    error: err.message || "Internal Server Error",
    data: err.data ? err.data : null
  })
});

module.exports = app;
