var gitlab = require('../controllers/gitlab_controller');
var worktileOauth2 = require('../controllers/oauth2_worktile_controller');
var home = require('../controllers/home_controller');
module.exports = function (app) {
    app.post('/gitlab', gitlab.process);
    app.get('/oauth2/login/worktile',worktileOauth2.login);
    app.get('/oauth2/callback/worktile',worktileOauth2.callback);
    app.get('/',home.index);
};