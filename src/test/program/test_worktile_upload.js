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
    worktileApi.uploadFile({
        pid:'119055ba0c384527b957ee35299950f4',
        folder_id:'1f6bcb3278d841189742425558ce1ebb',
        file:{
            value:    fs.createReadStream(__dirname + '/data/b219ebc4b74543a96d0bc77c19178a82b9011469.jpg'),
            options:{
                filename:'b219ebc4b74543a96d0bc77c19178a82b9011469.jpg'
            }
        }
    },function(err,result) {
        if (err) {
            slogger.error('上传文件','失败');
        } else {
            slogger.debug('上传文件','成功');
        }
    });

});