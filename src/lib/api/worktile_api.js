/**
 * User: sunny
 * Date: 16-3-20
 * Time: 下午12:19
 */
const BASE_URL = 'https://api.worktile.com/v1';
var request = require('request');

var config = require('../../config');
var slogger = require('../slogger');
const TIME_OUT_MILLISECONDS = 100*1000;
function parseResponse(url,description, error,response,body,callback) {
    if (error) {
        slogger.error('请求'+url+'失败',error);
        callback('请求'+description+'网络错误');
        return;
    }
    if (!response) {
        callback('请求'+description+'失败，未知错误');
        return;
    }
    if (response.statusCode != 200) {
        slogger.error(url, response.statusCode, body);
        callback('请求'+description+'失败['+response.statusCode+']');
        return;
    }
    callback(false,body);
}

function doUpload(url,qs, params,description, callback) {
    qs.access_token = config.tokenInit;
    var options = {
        qs:qs,
        json:true,
        timeout:TIME_OUT_MILLISECONDS,
        formData:params
    };

    slogger.debug('请求地址',url,'请求参数',options);
    request.post(url,options,function(error,response,body) {
        parseResponse(url,description,error,response,body,callback);
    });
}

exports.uploadFile = function(params,callback) {
    doUpload(BASE_URL+'/file',{pid:params.pid},params,'上传文件',callback);
}

function doDocOperation(url,params,method,description,callback) {
    var qs = {
        access_token:config.tokenInit,
        pid : params.pid
    };
    delete params.pid;
    var options = {
        url:BASE_URL+url,body:params,json:true,method:method,qs:qs
    };
    slogger.debug('请求地址',url,'请求参数',options);

    request(options,function(error,response,body) {
        parseResponse(url,description,error,response,body,callback);
    });
}

exports.modifyDoc = function(params,callback) {
    var pageId = params.pageId;
    delete  params.pageId;
    doDocOperation('/pages/'+pageId,params,'PUT','修改文档',callback);
}