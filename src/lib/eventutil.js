
exports.publish = function(em,eventName,var1,var2,var3){
    var args = Array.prototype.slice.call(arguments,1,arguments.length);

    setImmediate(function(){
        em.emit.apply(em,args);
    });
};

