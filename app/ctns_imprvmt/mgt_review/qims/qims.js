/**
 * Created by Bishaka on 16/11/2015.
 */
var
    Promise = require('bluebird'),
    qims = angular.module('ctns_imprvmt.mgt_review.qims',[])
    .config(['$stateProvider','$urlRouterProvider',function($stateProvider,$urlRouterProvider){
        $stateProvider
            .state('ctns_imprvmt.mgt_review.qims',{
                url:'/qims',
                views:{
                    'root.ctns_imprvmt.mgt_review.workbench@ctns_imprvmt.mgt_review':{
                        templateUrl:'ctns_imprvmt/mgt_review/qims/qims.html'
                    }
                }
            })

    }])
    .controller('ctns_imprvmt.mgt_review.qimsCtrl',['$scope','_checklists_','_backend_','_qims_',function($scope,_checklists_,_backend_,_qims_){
            $scope.rv = {
                name : "",
                cl : ""
            };

            $scope.editRvId = "";

            var
                    loadChecklists = function(){
                        _checklists_.load().then(function(checklists){
                            $scope.$apply(function(){
                                var i, max, id, name;
                                $scope.nameMap = {};
                                for(i = 0, max = checklists.length; i < max; i+= 1){
                                    id = checklists[i]._id;
                                    name = checklists[i].name;
                                    $scope.nameMap[id] = name;
                                }
                                $scope.checklists = checklists;

                            })
                        });
                    },

                    loadqims = function(){
                        _qims_.load().then(function(qims){
                            $scope.$apply(function(){
                                $scope.qims = qims;
                            })
                        });
                    }
            ;

            loadChecklists();
            loadqims();

            $scope.createRv = function(){
                console.log("Saving : " + $scope.rv.name);
                var obj = $scope.rv;
                    obj["type"] = "cim.mgt_review.qim";
                _backend_.saveToDb("cim",obj).then(function(){
                    _backend_.alert({ src :"cim.mgt_review.qims",title : "qim added", text : $scope.rv.name + " has been saved"})
                    loadqims();
                    $scope.rv.name = "";
                });
            };

            $scope.deleteRv = function(rv){
                    console.log("Deleting : " + rv.name);
                _qims_.del(rv).then(function(){
                    loadqims();
                })
            }

            $scope.editRv = function(rv){
                $scope.editRvId = rv._id;
            }

            $scope.saveEditRv = function(rv){
                var
                    name = $("[id='_rv_edit_name_"+rv._id+"']").val(),
                    cl = $("[id='_rv_edit_cl_"+rv._id+"']").val()
                ;

                console.log("Name : " + name)
                console.log("cl : " + cl)

                _qims_.upd8(rv._id,{name:name,cl:cl}).then(function(){
                    $scope.editRvId = "";
                    loadqims();
                })
            };

            $scope.cancelEditRv = function(){
                $scope.editRvId = "";
            }
    }])
    .factory('_qims_',['_backend_',function(_backend_){
    var _gut = {};

    _gut.get = function(id){
        return new Promise(function(resolve, reject){
            var
                dbname = "cim",
                func = "findOne",
                args = [{_id:id}]
                ;
            _backend_.execInDb(dbname,func,args).then(function(qim){
                resolve(qim);
            })
        });
    }

    _gut.load = function(){
        return new Promise(function(resolve, reject){
            var
                dbname = "cim",
                func = "find",
                args = [{type:"cim.mgt_review.qim"}]
                ;

            _backend_.execInDb(dbname,func,args).then(function(qims){
                qims = _backend_.sortByTimestamp({"array":qims,sort:"des"});
                resolve(qims);
            })
        });
    };

    _gut.del = function(rv){
            return new Promise(function(resolve, reject){
                var
                    dbname = "cim",
                    func = "remove",
                    args = [{_id:rv._id},{}]
                    ;
                _backend_.execInDb(dbname,func,args).then(function(results){
                    _backend_.alert({ src :"cim.mgt_review.checklists",title : "qim deleted", text : rv.name + " has been deleted"});
                    resolve();
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
                _backend_.alert({ src :"cim.mgt_review.qims",title : "qim update", text :"qim has been updated to " + opts.name});
                resolve();
            })
        });
    };

    return _gut;
}])

;