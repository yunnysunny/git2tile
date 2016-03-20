/**
 * User: sunny
 * Date: 14-4-15
 * Time: 上午10:00
 */
var request = require('request');
var crypto = require('crypto');
var URLSafeBase64 = require('../urlsafe-base64');
require('../string');
var time = require('../time');
var slogger = require('../slogger');
var httpUtil = require('../http_util');
/**
 *
 * @param option
 * @constructor
 */
function OAuth2(option) {
    if (option) {
        for(var key in option) {
            this[key] = option[key];
        }
    }

}
OAuth2.prototype._createState =function(req,params,callback) {
    var self = this;
    crypto.randomBytes(16,function(err,buf) {
        if (err) {
            callback(err);
            return;
        }
        var rand = new Buffer(buf).toString('hex');
        var state = params && params instanceof Object  ? params : {};
        state['type'] = self.type;
        state['time'] = new Date().getTime();
        state['rand'] = rand;

//        req.session.rand = rand;
        var str = JSON.stringify(state) + '';
        callback(false, URLSafeBase64.encode(new Buffer(str,'utf8')));
    });

}
OAuth2.prototype.getAuthUrl = function(req,params,callback) {
    var self = this;
    this._createState(req,params,function(err,state) {
        if (err) {
            callback(err);
            return;
        }
        var url = self.authUrl + '?' + 'client_id=' + self.clientId + '&response_type=code&redirect_uri='+self.redirectUri + '&state=' + state;
        callback(false,url);
    });
}
/**

 * @param code
 * @param callback
 */
OAuth2.prototype.getAccessToken = function(code, callback) {
    var options = {
        form:{
            client_id:this.clientId,
            client_secret:this.clientSecret,
            grant_type:'authorization_code',
            code : code,
            redirect_uri:this.redirectUri
        },
        json:true
    };
    slogger.trace('开始请求access token',options);
    request.post(this.accessTokenUrl,options,function(error,response,body){
        slogger.trace('access token 请求结束',error,body);
        if(error){
            callback(error);
        }else{
            callback(false,body);
        }
    });
}

OAuth2.prototype.refreshAccessToken = function(refreshToken, callback) {
//    var options = {
//        qs:{
//            client_id:this.clientId,
//            refresh_token : refreshToken
//        },
//        json:true
//    };
//    slogger.trace('开始刷新access token',options);
    httpUtil.doGet(this.refreshTokenUrl,{
        client_id:this.clientId,
        refresh_token : refreshToken
    },'刷新access token',function(error,body){
        slogger.trace('刷新access token 请求结束',error,body);
        if(error){
            callback(error);
        }else{
            callback(false,body);
        }
    });
}

module.exports = OAuth2;