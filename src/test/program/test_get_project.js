/**
 * User: sunny
 * Date: 16-3-20
 * Time: 上午11:52
 */
var config = require('../../config');
var gitlab = config.gitlab;

gitlab.projects.all(function(projects) {
    for (var i = 0; i < projects.length; i++) {
        console.log("#" + projects[i].id + ": " + projects[i].name + ", path: " + projects[i].path + ", default_branch: " + projects[i].default_branch + ", private: " + projects[i]["private"] +/* ", owner: " + projects[i].owner.name + " (" + projects[i].owner.email +*/ "), date: " + projects[i].created_at);
    }
});