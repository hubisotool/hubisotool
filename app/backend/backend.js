/**
 * Created by Bishaka on 26/10/2015.
 */
var
    Promise = require('bluebird'),
    njs_backend = require("backend"),
    win = require('nw.gui').Window.get(),
    app = require('nw.gui').App,

    module_backend = angular.module('backend',[])

    .config([function(){
            console.log("Datapath : \n"+app.dataPath);
            njs_backend.startup({datapath:app.dataPath});

            win.on('close', function() {
                console.log("Shutdown script called");
                njs_backend.shutdown();
                app.quit();
            });
    }])

    .factory('_backend_',[function(){
        var _gut = {};
        _gut["dnr"] = {};
        _gut["dnr"]["settings"] = {};
        _gut["dnr"]["settings"]["docCtrl"] = {};

        _gut["dnr"]["settings"]["docCtrl"].load = function(){
            return new Promise(function(resolve, reject){
                njs_backend.loadFromDb("dnr","find",{type:"dnr.settings.docCtrl"})
                .then(function(docCtrls){
                    docCtrls.sort(function(a,b){
                        return moment(a["_timestamp"]).isAfter(b["_timestamp"]);
                    });
                    resolve(docCtrls[docCtrls.length-1])
                })
            });
        };

        _gut["dnr"]["settings"]["docCtrl"].save = function(obj){
            obj["type"] = "dnr.settings.docCtrl";
            njs_backend.saveToDb("dnr",obj);
        };

        _gut["alert"] = function(opts){
            njs_backend.alert(opts);
        };
        return _gut;
    }])
;