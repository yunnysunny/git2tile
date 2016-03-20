/**
 * User: sunny
 * Date: 14-3-20
 * Time: 下午4:33
 */
function formatDayMonth(element) {
    return  element < 10 ? ('0' + element) : element;
}
function formatDateStr(year,month,day) {
    month = formatDayMonth(month);
    day = formatDayMonth(day);
    var str = month+'-'+day;
    if (year !== false) {
        str = year + '-' + str;
    }
    return str;
}
function DayUtil(referenceDay) {
    referenceDay = referenceDay || new Date();
    if (typeof (referenceDay) == 'string') {
        referenceDay = referenceDay.replace(/-/g,'/');
        referenceDay = new Date(referenceDay);
    }
    var currentDay = referenceDay.getDate();
    var currentMonth = referenceDay.getMonth();
    var currentYear = referenceDay.getFullYear();
    this.referenceDayObj = referenceDay;
    this.referenceDayData = {day:currentDay,month:currentMonth,year:currentYear};
}
DayUtil.prototype.getCurrentDayStr = function() {
    var dayDate = this.referenceDayData;
    return formatDateStr(dayDate.year,dayDate.month+1,dayDate.day);
}
DayUtil.prototype.getAnyDayStr = function(dayDistance,withoutYear) {
    var dayDate = this.referenceDayData;
    var day = new Date(dayDate.year,dayDate.month,dayDate.day+dayDistance);
    var year = withoutYear === true ? false : day.getFullYear();
    var dayStr = formatDateStr(year,day.getMonth()+1,day.getDate());
    return dayStr;
}
module.exports =DayUtil;



