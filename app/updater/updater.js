/**
 * Created by Bishaka on 05/01/2016.
 */

var
    fs = require('fs'),
    request = require('request'),
    gui = require('nw.gui'),
    prettysize = require('prettysize'),
    prettytime = require('prettytime'),
    progress = require('request-progress'),
    bc_dprog = "dwnld-progress",
    OsTmpDir = require('os-tmpdir'),
    Promise = require('bluebird'),
    nw_updater = require('node-webkit-updater'),
    pkg = require('../package.json'),
    upd = new nw_updater(pkg),
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
            });
        $urlRouterProvider.otherwise('/docs_n_records');
    }])
    .controller('updaterCtrl',['$scope','updater','logger','updaterLogSrc',function($scope,updater,log,logSrc){
        $scope.install = false;
        $scope.step_check = true;
        $scope.step_download = false;
        $scope.step_install = false;
        $scope.step_restart = false;

        $scope.trans = "0kb";
        $scope.total = "0kb";
        $scope.time = "0kb";
        $scope.percent = "0%";
        $scope.speed = "0kb/s";
        $scope.do_download = function(){
            $scope.step_check = false;
            $scope.step_download = true;
            updater.doUpdate();
        };

        $scope.$on('latest_version',function(e,args){
            $scope.$apply(function(){
                $scope.latest_version = args.ver;
            })
        });

        $scope.$on('step_install',function(){
            log.debug({src:logSrc,diagId:"updaterCtrl::$on::step_install",msg:"Executing install step"});
            $scope.$apply(function(){
                $scope.step_download = false;
                $scope.step_install = true;
            });
            log.debug({src:logSrc,diagId:"updaterCtrl::$on::step_install",msg:"Getting latest version"});
            updater.getLatestVersion().then(function(ver){
                log.debug({src:logSrc,diagId:"updaterCtrl::$on::step_install",msg:"Version got : " + ver});
                log.debug({src:logSrc,diagId:"updaterCtrl::$on::step_install",msg:"Building filename : "});
                var filename = updater.buildDnwldFileName(ver);
                filename = OsTmpDir() + "/"+filename;
                log.debug({src:logSrc,diagId:"updaterCtrl::$on::step_install",msg:"Filename built : " + filename});
                log.debug({src:logSrc,diagId:"updaterCtrl::$on::step_install",msg:"Unpacking file"});
                upd.unpack(filename, function(error, newAppPath) {
                    if (!error) {
                        log.debug({src:logSrc,diagId:"updaterCtrl::$on::step_install",msg:"Finished unpacking file"});
                        log.debug({src:logSrc,diagId:"updaterCtrl::$on::step_install",msg:"Running installer"});
                        upd.runInstaller(newAppPath, [upd.getAppPath(), upd.getAppExec()],{});
                        log.debug({src:logSrc,diagId:"updaterCtrl::$on::step_install",msg:"Quiting App"});
                        gui.App.quit();
                    }else{
                        log.debug({src:logSrc,diagId:"updaterCtrl::$on::step_install",msg:"Error while unpacking file"});
                        log.debug({src:logSrc,diagId:"updaterCtrl::$on::step_install",msg:"Error : " + error});
                    }
                },pkg);
            });
        });

        $scope.cancel = function(){
            require('nw.gui').Window.get().close();
        };

    }])
    .factory('updater',['$rootScope','$http','logger','updaterLogSrc',function($rootScope,$http,log,logSrc){
        var
            _gut = {}
        ;

         _gut.doUpdate = function(){
             _gut.getLatestVersion().then(_gut.downloadNewVersion);
         };

        _gut.getLatestVersion = function(){
            return new Promise(function(resolve,reject){
                var request = $http({
                    method: "get",
                    url: "https://api.github.com/repos/hubisotool/hubisotool/tags"
                });
                request.then( function(tags){
                    resolve(tags["data"][0].name)
                });
            })
        };

        _gut.downloadNewVersion = function(ver){
            return new Promise(function(resolve,reject){
                log.debug({src:logSrc,diagId:"updater::downloadNewVersion",msg:"Dowloading new version : " + ver});
                var
                    url = _gut.buildDwnldPath(ver),
                    filename = _gut.buildDnwldFileName(ver),
                    dir = OsTmpDir(),
                    destFilename = dir+"/"+filename;
                log.debug({src:logSrc,diagId:"updater::downloadNewVersion",msg:"Download path resolved : " + url});
                log.debug({src:logSrc,diagId:"updater::downloadNewVersion",msg:"TmpDir : " + dir});
                log.debug({src:logSrc,diagId:"updater::downloadNewVersion",msg:"Dest File name : " + destFilename});

                // The options argument is optional so you can omit it
                progress(request(url), {
                    throttle: 300,                    // Throttle the progress event to 2000ms, defaults to 1000ms
                    delay: 1000                       // Only start to emit after 1000ms delay, defaults to 0ms
                })
                .on('progress', function (state) {
                    var
                        percentage = state.percentage * 100,
                        speed = prettysize(state.speed),
                        size_tt = prettysize(state.size.total),
                        size_tf = prettysize(state.size.transferred),
                        time_el = prettytime(state.time.ellapsed*1000,{ decimals: 0}),
                        time_rem = prettytime(state.time.remaining*1000,{ decimals: 0 })
                    ;
                    percentage = percentage.toFixed(2);
                    log.debug({src:logSrc,diagId:"updater::downloadNewVersion",msg:"State : " + JSON.stringify(state)});
                    log.debug({src:logSrc,diagId:"updater::downloadNewVersion",msg:"Percentage : " + percentage + " %"});
                    log.debug({src:logSrc,diagId:"updater::downloadNewVersion",msg:"Speed : " + speed + "/s"});
                    log.debug({src:logSrc,diagId:"updater::downloadNewVersion",msg:"Size Total : " + size_tt});
                    log.debug({src:logSrc,diagId:"updater::downloadNewVersion",msg:"Size Transferred : " + size_tf});
                    log.debug({src:logSrc,diagId:"updater::downloadNewVersion",msg:"Time elapsed : " + time_el});
                    log.debug({src:logSrc,diagId:"updater::downloadNewVersion",msg:"Time remaining : " + time_rem});
                    log.debug({src:logSrc,diagId:"updater::downloadNewVersion",msg:"----------------------------------------------------"});
                    $rootScope.$broadcast(bc_dprog, {percentage:percentage,speed:speed,total:size_tt,trans:size_tf,time:time_rem});
                })
                .on('error', function (err) {
                    // Do something with err
                })
                .on('end',function(){

                    log.debug({src:logSrc,diagId:"updater::downloadNewVersion",msg:"Download completed !"});
                    log.debug({src:logSrc,diagId:"updater::downloadNewVersion",msg:"----------------------------------------------------"});
                    $rootScope.$broadcast(bc_dprog, {percentage:"100"});
                    resolve();
                })
                .pipe(fs.createWriteStream(destFilename));


            });
        };
        _gut.buildDnwldFileName = function(ver){
            var platform, arch = process.arch;
            switch(process.platform){
                case 'win32':
                    platform = "win";
                    break;
                case 'linux':
                    platform = "linux";
                    break;
            }
            return "hubisotool-"+ver+"-"+platform+"-"+arch+".zip";
        };

        _gut.buildDwnldPath = function(ver){
            var filename = _gut.buildDnwldFileName(ver);
            return "https://github.com/hubisotool/hubisotool/releases/download/"+ver+"/"+filename;
        };

        return _gut;
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
    .directive('updaterDaemon',['$rootScope','_backend_','$http','$state','logger','updaterLogSrc','updater',function($rootScope,b,$http,$state,log,logSrc,updater){
        var
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
            }
        ;
        var _gut = {}, curr_ver = require('nw.gui').App.manifest.version;
            _gut.link = function(scope){
                log.debug({src:logSrc,diagId:"updaterDaemon::link",msg:"Updater Daemon setup"});
                log.debug({src:logSrc,diagId:"updaterDaemon::link",msg:"Checking for latest version"});
                updater.getLatestVersion().then(function(latest_ver){
                    latest_ver = latest_ver.replace('v','');
                    log.debug({src:logSrc,diagId:"updaterDaemon::link",msg:"Version recieved : " + latest_ver});
                    log.debug({src:logSrc,diagId:"updaterDaemon::link",msg:"Current version : " + curr_ver});

                    if(curr_ver===latest_ver){
                        log.debug({src:logSrc,diagId:"updaterDaemon::link",msg:"Versions match"});
                    }else{
                        log.debug({src:logSrc,diagId:"updaterDaemon::link",msg:"Versions don't match"});
                        openUpdaterWindow();
                    }
                });

                scope.$on(bc_dprog, function(event, opts){
                    var controllerElement = document.querySelector('[data-hubiso-module="updater"]');
                    var controllerScope = angular.element(controllerElement).scope();

                    controllerScope.$apply(function(){
                        controllerScope.total = opts.total || controllerScope.total;
                        controllerScope.trans = opts.trans || controllerScope.total;

                        controllerScope.speed = opts.speed || "0kb";
                        controllerScope.speed = controllerScope.speed + "/s";

                        controllerScope.percent = opts.percentage || "0";
                        controllerScope.percent = controllerScope.percent + "%";

                        controllerScope.time = opts.time || "0s";
                    });

                    log.debug({src:logSrc,diagId:"updaterDaemon::link",msg:"Got download progress update : " + opts.percentage+"%"});
                    $("#update-progress").css({width: opts.percentage+'%'});

                    if(opts.percentage === '100'){
                        log.debug({src:logSrc,diagId:"updaterDaemon::link",msg:"Calling install step"});
                        $rootScope.$broadcast('step_install');
                    }

                });

            };
        return _gut;
    }])
;