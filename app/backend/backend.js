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
            require('nw.gui').Window.get().showDevTools();
            console.log("Datapath : "+app.dataPath);
            console.log("Platform : "+navigator.platform);
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

        _gut["dnr"]["ml"] = {};
        _gut["dnr"]["ml"]["docs"] = {};
        _gut["dnr"]["ml"]["doc"] = {};
        _gut["dnr"]["ml"]["docs"].load = function(cat){
            return new Promise(function(resolve, reject){
                njs_backend.loadFromDb("dnr","find",{type:"dnr.ml.doc",cat:cat})
                .then(function(docs){
                    resolve(docs);
                })
            })
        };

        _gut["dnr"]["ml"]["doc"].load = function(id){
            return new Promise(function(resolve, reject){
                njs_backend.loadFromDb("dnr","findOne",{"_id":id})
                    .then(function(doc){
                        resolve(doc);
                    })
            })
        };


        _gut.sortByTimestamp = function(opts){
            var
                array = opts["array"],
                sort  = opts["sort"] || "asc"
            ;
            array.sort(function(a,b){
                switch(sort){
                    case "asc":
                        return moment(a["_timestamp"]).isAfter(b["_timestamp"]);
                    case "des":
                        return moment(a["_timestamp"]).isBefore(b["_timestamp"]);
                }
            });
            return array;
        };

        _gut.saveToDb = function(dbname,obj){
            return njs_backend.saveToDb(dbname,obj);
        };

        _gut.addHeartBeat = function(fn){
            if(typeof fn === "function"){
                njs_backend.hubhb.add({intervals:{ "* * * * * *":[fn]}})
            }
        };

        _gut["alert"] = function(opts){
            njs_backend.alert(opts);
        };

        _gut["execInDb"] = function(dbname,func,args){
            return njs_backend.execInDb(dbname,func,args);
        };

        return _gut;
    }])
;