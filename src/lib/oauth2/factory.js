/**
 * User: sunny
 * Date: 14-4-15
 * Time: 下午4:40
 */
var worktile = require('./OAuth2Worklite').instance;
var config = require('../../config');
const OAUTH2_TYPE_WORKTILE = config.OAUTH2_TYPE_WORKTILE;


exports.getInstance = function(type) {
    var instance = null;
    switch (type) {
        case OAUTH2_TYPE_WORKTILE:
            instance =  worktile;
            break;
    }
    return instance;
}



