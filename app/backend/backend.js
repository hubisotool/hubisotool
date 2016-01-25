/**
 * Created by Bishaka on 26/10/2015.
 */
var
    Promise = require('bluebird'),
    njs_backend = require("backend"),
    win = require('nw.gui').Window.get(),
    app = require('nw.gui').App,
    gui = require('nw.gui'),
    pkg = require('../package.json'),
    copyPath,
    execPath,
    nw_updater = require('node-webkit-updater'),
    upd = new nw_updater(pkg),

    module_backend = angular.module('backend',[])

    .factory('_backend_',['$state',function($state){
        var _gut = {}, boot = function(){

            if(gui.App.argv.length) {
                // ------------- Step 5 -------------
                copyPath = gui.App.argv[0];
                execPath = gui.App.argv[1];

                // Replace old app, Run updated app from original location and close temp instance
                upd.install(copyPath, function(err) {
                    if(!err) {
                        upd.run(execPath, null);
                        gui.App.quit();
                    }
                });
            }

            console.log("Datapath : "+app.dataPath);
            console.log("Execpath : "+process.execPath);
            console.log("Version : " + require('../package.json').version);
            console.log("Platform : "+process.platform);
            console.log("Arch : "+process.arch);
            njs_backend.startup({datapath:app.dataPath});

            win.on('close', function() {
                console.log("Setting updater window open variable to false");
                njs_backend.execInDb("config","update",[{module:"updater"},{$set:{"updaterWindowOpen":"false"}},{multi:true}]).then(function(){
                    njs_backend.shutdown();
                    win.close(true);
                })
            });

        };

        boot();

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