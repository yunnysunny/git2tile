module.exports = function (app,numCPUs,port) {
    var cluster = require('cluster');
    //require('os').cpus().length;
    var workerList = [];
    var sigkill = false;

    if (cluster.isMaster) {
        for (var i = 0; i < numCPUs; i++) {
            var env = process.env;
            var worker = cluster.fork(env);
            workerList.push(worker);
            //进程消息广播
            worker.on('message', function (msg) {
   				workerList.forEach(function (wk) {
               	    wk.send(msg);
   	            });
   			});

        }

        process.on('SIGUSR2', function () {//重启子进程
            console.log("Received SIGUSR2 from system");
            console.log("There are " + workerList.length + " workers running");
            workerList.forEach(function (worker) {
                console.log("Sending STOP message to worker PID=" + worker.process.pid);
                worker.send({cmd: "stop"});//杀死老的子进程
            });
        });

        //用这个种方式 可以抛出exit事件做其他处理操作
        process.on('SIGINT', function () {
            sigkill = true;//
            process.exit();//杀死主进程
        });

        //子进程处理exit事件
        cluster.on('exit', function (worker) {
            if (sigkill) {//杀死主进程
                console.log("SIGKINT received - not respawning workers");
                return;
            }
            var newWorker = cluster.fork();//重启子进程
            //进程消息广播
            newWorker.on('message', function (msg) {
   				workerList.forEach(function (wk) {
               	    wk.send(msg);//
   	            });
   			});
            console.log('Worker ' + worker.process.pid + '  died and it will be re-spawned');

            removeWorkerFromListByPID(worker.process.pid);//从进程列表中移除老的子进程
            workerList.push(newWorker);//添加新的子进程
        });
    } else {
        process.on('message', function (msg) {
            if (msg.cmd && msg.cmd == 'stop') {
                console.log("Received STOP signal from master");
                app.close();
                process.exit();
            }
        });
        app.listen(port);
        console.log('listen on port:'+port);
    }

    function removeWorkerFromListByPID(pid) {
        var counter = -1;
        workerList.forEach(function (worker) {
            ++counter;
            if (worker.process.pid === pid) {
                workerList.splice(counter, 1);
            }
        });
    }
}