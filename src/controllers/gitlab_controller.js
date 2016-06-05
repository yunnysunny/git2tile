/**
 * User: sunny
 * Date: 15-4-15
 * Time: 上午10:42
 */
var path = require('path');
var streamBuffers = require('stream-buffers');
var config = require('../config');
var gitlab = config.gitlab;
var slogger = require('../lib/slogger');
var worktileApi = require('../lib/worktile_api');

const CONFIG_PROJECT_FILE = config.uploadConfig;

function getTitle(content) {
    if (!content || content.length === 0) {
        return '';
    }
    var titlePositionBegin = -1;
    var titlePositionEnd = -1;
    var title = '';
    var lastChar = '';
    for(var i= 0,len=content.length;i<len;i++) {
        var c = content.charAt(i);
        if (c === '#' && (
            lastChar === '' || lastChar ===' ' || lastChar === '\t' || lastChar === '\b'
            ) ) {
            c = content.charAt(++i);
            if (c !== '#') {
                titlePositionBegin = 1;
            }
            continue;
        }

        if (c === '\r' || c === '\n') {
            if (titlePositionBegin !== -1) {
                title = content.substring(titlePositionBegin,i-1);
                break;
            }
            lastChar = '';
        }
    }
    return title;
}

function processFile(gitFile,filename,repositoryData) {
    if (gitFile.upload) {
        gitlab.projects.repository.showFile({
            projectId:repositoryData.project_id,
            ref: 'master',
            file_path:filename
        },function(file) {
            if (file) {
                var worktileData = repositoryData.worktile;
                if (worktileData.fileType === 'doc') {
                    var pageData = worktileData.pageData;
                    if (!pageData[filename]) {
                        return slogger.error('当前文件的worktile文档关联信息为空');
                    }
                    var content = new Buffer(file.content, 'base64').toString();
                    worktileApi.modifyDoc({
                        pageId:pageData[file],
                        pid:worktileData.projectId,
                        content : content,
                        name:getTitle(content)
                    },function(err,result) {
                        if (err) {
                            slogger.error('修改文档',file,'失败');
                        } else {
                            slogger.debug('修改文档',file,'成功');
                        }
                    });
                } else {
                    worktileApi.uploadFile({
                        pid:worktileData.projectId,
                        folder_id:worktileData.folderId,
                        file:{
                            value:streamBuffers.ReadableStreamBuffer(new Buffer(file.content, 'base64')),
                            options:{
                                filename:path.basename(file)
                            }
                        }
                    },function(err,result) {
                        if (err) {
                            slogger.error('上传文件',file,'失败');
                        } else {
                            slogger.debug('上传文件',file,'成功');
                        }
                    });
                }

            } else {
                slogger.error('获取文件',file,'失败');
            }
        });
    }
}

exports.process = function(req, res) {
    var event = req.headers['x-gitlab-event'];
    console.log('event',event);
    var data = req.body;
    console.log('data',data);
    var repository = data.repository || {};
    var repositoryData = CONFIG_PROJECT_FILE[repository.url];
    if (!repositoryData) {
        slogger.error('未找到当前项目的配置信息');
        return res.send('no setting');
    }
    if (repositoryData.ref !== 'refs/heads/master') {
        slogger.error('不是主分支')
        return res.send('not master');
    }
    var files = repositoryData.files;
    var uploadData = {};
    files.forEach(function(file) {
        uploadData[file] = {upload:false,delete:false};
    });
    switch(event) {

        case 'Push Hook' :
            if (data.total_commits_count > 0 && data.commits.length > 0) {
                var commits = data.commits;
                var added,modified,removed;
                commits.forEach(function(commit) {
                    added = commit.added || [];
                    modified = commit.modified || [];
                    removed = commit.removed || [];
                    for (var file in uploadData) {
                        if (added.indexOf(file) !== -1 || modified.indexOf(file) !== -1) {
                            uploadData[file].upload = true;
                            uploadData[file].delete = false;
                        }
                        if (removed.indexOf(file) !== -1) {
                            uploadData[file].upload = false;
                            uploadData[file].delete = true;
                        }
                    }
                });

            }
            for (var file in uploadData) {
                processFile( uploadData[file], repositoryData);
            }


            break;
    }
    res.send('OK');
}



