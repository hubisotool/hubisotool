/**
 * Created by Bishaka on 05/01/2016.
 */

var
    Promise = require('bluebird'),
    updater = angular.module('updater',[])
    .config(['$stateProvider','$urlRouterProvider',function($stateProvider,$urlRouterProvider){
        $stateProvider
            .state('updater',{
                url:'/updater',
                views:{
                    'root.workbench':{
                        templateUrl:'updater/updater.html'
                    }
                }
            })
        $urlRouterProvider.otherwise('/docs_n_records');
    }])
    .controller('updaterCtrl',['$scope',function($scope){
        $scope.install = false;
        $scope.do_install = function(){
            $scope.install = true;
        }
        $scope.cancel = function(){
            require('nw.gui').Window.get().close();
        }
    }])
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
    .directive('updaterDaemon',['_backend_','$http','$state','logger','updaterLogSrc',function(b,$http,$state,log,logSrc){
        var
            getLatestVersion = function(){
                return new Promise(function(resolve,reject){
                    var request = $http({
                        method: "get",
                        url: "https://api.github.com/repos/hubisotool/hubisotool/tags"
                    });
                    request.then( function(tags){
                        resolve(tags["data"][0].name)
                    });
                })
            },
            openUpdaterWindow = function(){
                log.debug({src:logSrc,diagId:"updaterDaemon::openUpdaterWindow",msg:"Current state name : " + $state.current.name});
                if($state.current.name!=="updater"){
                    log.debug({src:logSrc,diagId:"updaterDaemon::openUpdaterWindow",msg:"Checking for updater config doc"});
                    b.execInDb("config","find",[{module:"updater"}]).then(function(docs){
                        log.debug({src:logSrc,diagId:"updaterDaemon::openUpdaterWindow",msg:"Doc size recieved : " + docs.length});
                        if(docs.length < 1){
                            var obj = {module:"updater","updaterWindowOpen":"true"};
                            b.saveToDb("config",obj).then(function(){
                               require('nw.gui')
                                        .Window
                                        .open(  'shell.html#/updater',
                                                {
                                                    "toolbar":false,
                                                    "width": 500,
                                                    "height": 450,
                                                    "position": "center",
                                                    "min_width": 500,
                                                    "min_height": 450,
                                                    "max_width": 500,
                                                    "max_height": 450
                                                });
                            })
                        }else{
                            var doc = docs[0]
                            log.debug({src:logSrc,diagId:"updaterDaemon::openUpdaterWindow",msg:"Updater window open status : " + doc.updaterWindowOpen});
                            if(doc.updaterWindowOpen==="false"){
                                log.debug({src:logSrc,diagId:"updaterDaemon::openUpdaterWindow",msg:"Seting updater window status to true "});
                                b.execInDb("config","update",[{"_id":doc._id},{$set:{"updaterWindowOpen":"true"}},{multi:true}])
                                    .then(function(){
                                        log.debug({src:logSrc,diagId:"updaterDaemon::openUpdaterWindow",msg:"Finished seting updater window status to true"});
                                        require('nw.gui')
                                            .Window
                                            .open(  'shell.html#/updater',
                                            {
                                                "toolbar":false,
                                                "width": 500,
                                                "height": 450,
                                                "position": "center",
                                                "min_width": 500,
                                                "min_height": 450,
                                                "max_width": 500,
                                                "max_height": 450
                                            });
                                    })
                            }
                        }
                    })
                }
            },
            downloadNewVersion = function(latest_ver){
                //generate file name to download
            }
        ;
        var _gut = {}, curr_ver = require('nw.gui').App.manifest.version;
            _gut.link = function(){
                log.debug({src:logSrc,diagId:"updaterDaemon::link",msg:"Updater Daemon setup"});
                log.debug({src:logSrc,diagId:"updaterDaemon::link",msg:"Checking for latest version"});
                getLatestVersion().then(function(latest_ver){
                    latest_ver = latest_ver.replace('v','');
                    log.debug({src:logSrc,diagId:"updaterDaemon::link",msg:"Version recieved : " + latest_ver});
                    log.debug({src:logSrc,diagId:"updaterDaemon::link",msg:"Current version : " + curr_ver});

                    if(curr_ver===latest_ver){
                        log.debug({src:logSrc,diagId:"updaterDaemon::link",msg:"Versions match"});
                        openUpdaterWindow();
                    }else{
                        log.debug({src:logSrc,diagId:"updaterDaemon::link",msg:"Versions don't match"});
                    }

                })
            }
        return _gut;
    }])
;