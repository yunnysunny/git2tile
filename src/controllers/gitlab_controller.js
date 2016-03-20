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
                if ( uploadData[file].upload) {
                    gitlab.projects.repository.showFile({
                        projectId:repositoryData.project_id,
                        ref: 'master',
                        file_path:file
                    },function(file) {
                        if (file) {
                            var worktileData = repositoryData.worktile;
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
                        } else {
                            slogger.error('获取文件',file,'失败');
                        }
                    });
                }
            }


            break;
    }
    res.send('OK');
}



