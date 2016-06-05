/**
 * User: sunny
 * Date: 16-3-20
 * Time: 下午1:25
 */
var fs = require('fs');
var oauth2Worktile =require('../../models/oauth2_worktile_models');
var worktileApi = require('../../lib/api/worktile_api');
var slogger = require('../../lib/slogger');
oauth2Worktile.refreshToken(function(err) {
    if (err) {
        return errorlogger.error('刷新token失败',err);
    }
    worktileApi.modifyDoc({
        pid:'69bd42ccae144fbbb7c63269394842ee',
        pageId:'8e111a59e36948e6af1fdd2a25f1d301',
        content: fs.readFileSync(__dirname + '/data/readme.md').toString(),
        name:'readme.md'

    },function(err,result) {
        console.log(err,result);
        if (err) {
            slogger.error('上传文件','失败');
        } else {
            slogger.debug('上传文件','成功');
        }
    });

});