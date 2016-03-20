/**
 * User: sunny
 * Date: 14-3-5
 * Time: 上午10:20
 */
exports.mergeNumberArray = function(array1,array2) {
    if(array1 instanceof  Array && array2 instanceof Array) {

        for(var i= 0,len=array2.length;i<len;i++) {
            var e = array2[i];
            if (array1.indexOf(e) == -1 && !isNaN(e) && e != null) {
                array1.push(e);
            }
        }
        return array1;
    } else if (array1 instanceof Array) {
        return array1;
    } else if (array2 instanceof Array) {
        return array2;
    } else {
        return [];
    }

}