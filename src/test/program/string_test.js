var fs = require('fs');
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
console.log(getTitle(fs.readFileSync(__dirname + '/data/readme.md').toString()));