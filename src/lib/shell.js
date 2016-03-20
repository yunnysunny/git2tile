/**
 * User: sunny
 * Date: 14-3-28
 * Time: 上午11:28
 */
exports.parse = function() {
    var arguments = process.argv.splice(2);
    var params = {};
    for(var i= 0,len=arguments.length;i<len;i++) {
        var paramStr = arguments[i];
        var paramArray = paramStr.split('=');
        if (paramArray.length == 2) {
            var key = paramArray[0];
            if (key.charAt(0) == '-' && key.charAt(1) == '-') {
                key = key.substr(2);
            } else if (key.charAt(0) == '-') {
                key = key.substr(1);
            }
            var value = paramArray[1];
            params[key] = value;
        }
    }
    return params;
}

exports.setEnv = function(defaultEnv) {
	if (!process.env.TYPE) {
		var params = exports.parse();//读取命令行参数，node app.js -t=60中，读取t参数
		var t = params['type'] || params['t'];
		if (t) {
			process.env.TYPE = t;
		} else {
			var type = process.env.ENV_TYPE_FROM_SHELL;
			if (type) {//从环境变量中读取参数
				process.env.TYPE = type;
			} else {//使用默认TYPE值
				process.env.TYPE = defaultEnv;
			}
		}
	}
}