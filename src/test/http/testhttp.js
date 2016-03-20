/**
 * User: sunny
 * Date: 13-12-20
 * Time: 下午1:14
 */
process.env.TYPE='local';
var util = require('util');
var request = require('request');
function test(url, param) {
    var options = {
        form:param
    };
    request.post(url,options,function(error,response,body) {

        if (error) {
            console.error(error);
        } else if (response.statusCode == 200) {
            console.log(body);
            var result = eval('(' + body + ')');
            console.log(util.inspect(result,false,null,true));
        } else {
            console.error('code:' + response.statusCode);
            console.log(body);
        }
    });
}
exports.test = test;

var chars = ['0','1','2','3','4','5','6','7','8','9','A','B','C','D','E','F','G','H','I','J','K','L','M','N','O','P','Q','R','S','T','U','V','W','X','Y','Z'];

function generateMixed(n) {
    var res = "";
    for(var i = 0; i < n ; i ++) {
        var id = Math.ceil(Math.random()*35);
        res += chars[id];
    }
    return res;
}
exports.randStr = generateMixed;
