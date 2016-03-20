/**
 * User: sunny
 * Date: 13-10-28
 * Time: 下午6:44
 */
var config = require('../config');
var debuglogger = config .debuglogger;
var tracelogger = config.tracelogger;
var errorlogger = config.errorlogger;
var slogger = {
    debug : function() {
        debuglogger.debug.apply(debuglogger,arguments);
    },
    trace : function() {
        tracelogger.trace.apply(tracelogger,arguments);
    },
    warn : function() {
        errorlogger.warn.apply(errorlogger,arguments);
    },
    error : function() {
        errorlogger.error.apply(errorlogger,arguments);
    }
};

module.exports = slogger;