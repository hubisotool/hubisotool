/**
 * Created by Bishaka on 05/01/2016.
 */

var
    updater = angular.module('updater',[])
    .factory('updaterLogSrc',[function(){
        var logSrc="";
        try{
            throw new Error();
        }catch(err){
            var regex = /\(.*\)/,
                match = regex.exec(err.stack),
                filename = match[0].replace("(","").replace(")","");
            logSrc = filename;
        }
        return logSrc;
    }])

    .directive('updaterDaemon',[function(){
        var _gut = {};
            _gut.link = function(){
                console.log("Update Daemon up");
            }
        return _gut;
    }])
;