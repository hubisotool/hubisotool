/**
 * Created by Bishaka on 26/10/2015.
 */
var
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
        return _gut;
    }])
;