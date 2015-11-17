/**
 * Created by Bishaka on 16/11/2015.
 */
/**
 * Created by Bishaka on 16/11/2015.
 */
var
    Promise = require('bluebird'),
    checklists = angular.module('ctns_imprvmt.mgt_review.checklists',['backend','ctns_imprvmt.mgt_review.checklists.formbuilder'])
        .config(['$stateProvider','$urlRouterProvider',function($stateProvider,$urlRouterProvider){
            $stateProvider
                .state('ctns_imprvmt.mgt_review.checklists',{
                    url:'/checklists',
                    views:{
                        'root.ctns_imprvmt.mgt_review.workbench@ctns_imprvmt.mgt_review':{
                            templateUrl:'ctns_imprvmt/mgt_review/checklists/checklists.html'
                        }
                    }
                })

        }])
        .controller('ctns_imprvmt.mgt_review.checklistsCtrl',['$scope','_backend_','_checklists_','$state',function($scope,_backend_,_checklists_,$state){

            var loadChecklists = function(){
                _checklists_.load().then(function(checklists){
                    $scope.$apply(function(){
                        $scope.checklists = checklists;
                    })
                });
            };

            loadChecklists();

            $scope.createCl = function(){
                console.log("Saving : "+$scope.clname);
                var obj = {type:"cim.mgt_review.checklist",name:$scope.clname};
                _backend_.saveToDb("cim",obj).then(function(){
                    _backend_.alert({ src :"cim.mgt_review.checklists",title : "Checklist added", text : $scope.clname + " has been saved"})
                    loadChecklists();
                    $scope.clname = "";
                });
            };

            $scope.deleteCl = function(cl){
                var
                    dbname = "cim",
                    func = "remove",
                    args = [{_id:cl._id},{}]
                ;
                _backend_.execInDb(dbname,func,args).then(function(results){
                    _backend_.alert({ src :"cim.mgt_review.checklists",title : "Checklist deleted", text : cl.name + " has been deleted"})
                    func = "find";
                    args = [{type:"cim.mgt_review.checklist"}];
                    _backend_.execInDb(dbname,func,args).then(function(results){
                        $scope.$apply(function(){
                            $scope.checklists = _backend_.sortByTimestamp({"array":results,sort:"des"});
                        })
                    })
                })
            };

            $scope.editCl = function(cl){
                $state.transitionTo("ctns_imprvmt.mgt_review.checklists.edit", {id:cl._id});
            }

        }])

        .factory('_checklists_',['_backend_',function(_backend_){
            var _gut = {};

            _gut.load = function(){
                return new Promise(function(resolve, reject){
                    var
                        dbname = "cim",
                        func = "find",
                        args = [{type:"cim.mgt_review.checklist"}]
                    ;

                    _backend_.execInDb(dbname,func,args).then(function(checklists){
                        checklists = _backend_.sortByTimestamp({"array":checklists,sort:"des"});
                        resolve(checklists);
                    })
                });
            };

            _gut.upd8 = function(id,opts){
                return new Promise(function(resolve, reject){
                    var
                        dbname = "cim",
                        func = "update",
                        args = [{_id:id},{$set:opts},{}]
                        ;
                    _backend_.execInDb(dbname,func,args).then(function(results){
                        resolve();
                    })
                });
            };

            _gut.get = function(id){
                return new Promise(function(resolve, reject){
                    var
                        dbname = "cim",
                        func = "findOne",
                        args = [{_id:id}]
                        ;
                    _backend_.execInDb(dbname,func,args).then(function(checklist){
                        resolve(checklist);
                    })
                });
            }

            return _gut;
        }])

    ;