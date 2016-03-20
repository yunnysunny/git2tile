var express = require('express');
var path = require('path');
var log4js = require('log4js');
var http = require('http');

var bodyParser = require('body-parser');

var config = require('./config');
var routes = require('./routes/index');
var tracelogger = config.tracelogger;
var errorlogger = config.errorlogger;


var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
app.set('port', config.port);
// uncomment after placing your favicon in /public
//app.use(favicon(__dirname + '/public/favicon.ico'));
app.use(log4js.connectLogger(tracelogger, { level: log4js.levels.INFO }));

//app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.raw({ type: 'text/xml' }));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));


routes(app);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found:'+req.path);
  err.status = 404;
  next(err);
});

// error handlers

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  errorlogger.error('发现应用未捕获异常',err);
  res.render('common/error', {error:err});
});
var server = http.createServer(app);
exports.server = server;
