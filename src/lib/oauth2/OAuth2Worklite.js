/**
 * User: sunny
 * Date: 14-4-15
 * Time: 上午11:34
 */
var OAuth2 = require('./OAuth2');
var config = require('../../config');

const URL_AUTH_TAOBAO = 'https://open.worktile.com/oauth2/authorize';
const URL_ACCESS_TOKEN = 'https://api.worktile.com/oauth2/access_token';
const CLIENT_ID = config.clientId;
const CLIENT_SECRET = config.clientSecret;
const REDIRECT_URL = config.redirectUrl;

exports.instance = new OAuth2({
    authUrl:URL_AUTH_TAOBAO,
    accessTokenUrl: URL_ACCESS_TOKEN,
    refreshTokenUrl:'https://api.worktile.com/oauth2/refresh_token',

    clientId:CLIENT_ID,
    clientSecret:CLIENT_SECRET,
    redirectUri:REDIRECT_URL,
    type:config.OAUTH2_TYPE_WORKTILE
});
