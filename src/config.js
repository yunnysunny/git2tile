var log4js = require('log4js');

var configObj = require('../config.json');
var settings = require('./lib/settings').init(configObj);
exports.port = settings.loadNecessaryInt('port');

var debugFile = settings.loadNecessaryFile('debuglogfilename', true);
var traceFile = settings.loadNecessaryFile('tracelogfilename', true);
var errorFile = settings.loadNecessaryFile('errorlogfilename', true);

log4js.configure({
    appenders: [
        {type: 'console'},
        {type: 'dateFile', filename: debugFile, 'pattern': '-yyyy-MM-dd', backups: 10, category: 'debug'}, //
        {type: 'dateFile', filename: traceFile, 'pattern': '-yyyy-MM-dd', category: 'trace'},
        {type: 'file', filename: errorFile, maxLogSize: 1024000, backups: 10, category: 'error'}
    ],
    replaceConsole: true
});

exports.debuglogger = log4js.getLogger('debug');
exports.tracelogger = log4js.getLogger('trace');
exports.errorlogger = log4js.getLogger('error');

var privateKey = settings.loadNecessaryString('privateKey');
var gitlabApi = settings.loadNecessaryUrl('gitlabApi',false);
exports.gitlab =  require('gitlab')({
    url:   gitlabApi,
    token: privateKey
});

exports.clientId = settings.loadNecessaryString('clientId');
exports.clientSecret = settings.loadNecessaryString('clientSecret');
exports.redirectUrl = settings.loadNecessaryUrl('redirectUrl',false);

exports.uploadConfig = settings.loadNecessaryObject('uploadConfig');

exports.OAUTH2_TYPE_WORKTILE = 1;
exports.tokenInit = '';
exports.refreshToken = '';




