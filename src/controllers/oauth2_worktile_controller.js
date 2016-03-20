/**
 * User: sunny
 * Date: 16-3-12
 * Time: 下午5:45
 */
var config = require('../config')
var oauth2Factory =  require('../lib/oauth2/factory');
var oauth2Instance =oauth2Factory.getInstance(config.OAUTH2_TYPE_WORKTILE);
var oauth2Model = require('../models/oauth2_worktile_models');
exports.login = function(req, res) {
    oauth2Instance.getAuthUrl(req,{},function(err,url) {
        if (err) {
            return res.render('common/error',{error:err});
        }
        console.log('url',url);
        res.redirect(url);
    });
}

exports.callback = function(req, res) {
    oauth2Model.callback(req,function(err,accessToken) {
        if (err) {
            return res.render('common/error',{error:err});
        }
        res.render('test/token',{token:accessToken});
    });
}