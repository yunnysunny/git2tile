/**
 * User: sunny
 * Date: 16-3-12
 * Time: 下午9:27
 */
var config = require('../../config');
var oauth2Instance =require('../../lib/oauth2/factory').getInstance(config.OAUTH2_TYPE_WORKTILE);
oauth2Instance.refreshAccessToken('_jdG4h09RZ01JViuV0rqKrgslhI=tPbXOzML4520103abbab0bf1bd8677cf90b4f4231b57d6409b4fdbaf18011756ac3faedbac8266c395e14f2edf1822537681502e3f45863b528ab78a468b0bdd48954bb9fe295ba4e2c6ba04332eb4ba33107101',function(err,result) {
    console.log(err,result);
});