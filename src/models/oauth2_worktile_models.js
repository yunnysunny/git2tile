/**
 * User: sunny
 * Date: 16-3-12
 * Time: 下午5:58
 */
var slogger = require('../lib/slogger');
var URLSafeBase64 = require('../lib/urlsafe-base64');
var config = require('../config');
var factory = require('../lib/oauth2/factory');
var events = require('events');

var fs = require('fs');
var path = require('path');
var oauth2Instance =factory.getInstance(config.OAUTH2_TYPE_WORKTILE);
var oauthData = require('../data/oauth_worktile');

var parseCallback = function(req, callback) {
    var error = req.query.error_code;
    if (error) {
        var errorDesc = req.query.error_description;
        callback(errorDesc);
        return;
    }
    var state = req.query.state;
    if (!state) {
        callback('非法验证信息');
        return;
    }
    try {
        state = URLSafeBase64.decode(state).toString();
        state = JSON.parse(state);
//        if (req.session.rand != state.rand) {
//            callback('非法的登录凭证');
//            return;
//        }

        if (new Date().getTime() - state.time > 100 * 1000) {
            callback('登录超时');
            return;
        }

        var instance = factory.getInstance(state.type);
        if (!instance) {
            callback('不支持的登录类型：' + state.type);
            return;
        }

        instance.getAccessToken(req.query.code,function(err,body) {
            if (err) {
                slogger.error('获取用户凭证失败',err);
                callback('获取用户凭证失败');
                return;
            }

            if (body.error_code) {
                callback('token获取失败:'+body.error_description);
                return;
            }
            callback(false,instance,body,state);

        });
    } catch (e) {
        slogger.error('解析返回信息失败',e,state);
        callback('解析返回信息失败');
        return;
    }
}
exports.callback = function(req,callback) {

    parseCallback(req, function(err,instance,accessTokenResult,state) {
        if (err) {
            return callback(err);
        }
        var accessToken = accessTokenResult.access_token;
        callback(false,accessToken);
    });
    
}

var refreshTokenFun = exports.refreshToken = function(callback) {
    var refreshToken = oauthData.refresh_token || config.refreshToken;
    oauth2Instance.refreshAccessToken(refreshToken,function(err,result) {
        if (err) {
            callback('初始化刷新token失败');
            return slogger.error('初始化刷新token失败',err);
        }
        if (result.error_code) {
            callback(result.error_message);
            return slogger.error(result.error_message,result.error_code);
        }
        var ret = fs.writeFileSync(path.resolve(__dirname, '../data/oauth_worktile.json'),JSON.stringify(result));
        if (ret <= 0) {
            callback('保存access token失败');
            return slogger.error('保存access token失败');
        }
        config.tokenInit = result.access_token;
        var expires = result.expires_in*1000;
        expires = Math.min(0x7FFFFFFF,expires);
        setTimeout(function() {
            refreshTokenFun(function(err,result) {console.log(err,result);});
        }, expires);

        callback(false,result);
    });
}