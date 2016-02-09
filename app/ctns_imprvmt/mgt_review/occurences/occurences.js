/**
 * Created by Bishaka on 16/11/2015.
 */
var
    Promise = require('bluebird'),
    occurences = angular.module('ctns_imprvmt.mgt_review.occurences',[])
    .config(['$stateProvider','$urlRouterProvider',function($stateProvider,$urlRouterProvider){
        $stateProvider
            .state('ctns_imprvmt.mgt_review.occurences',{
                url:'/occurences',
                views:{
                    'root.ctns_imprvmt.mgt_review.workbench@ctns_imprvmt.mgt_review':{
                        templateUrl:'ctns_imprvmt/mgt_review/occurences/occurences.html'
                    }
                }
            })

    }])
    .controller('ctns_imprvmt.mgt_review.occurencesCtrl',['$scope','_checklists_','_backend_','_occurences_',function($scope,_checklists_,_backend_,_occurences_){
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

                    loadoccurences = function(){
                        _occurences_.load().then(function(occurences){
                            $scope.$apply(function(){
                                $scope.occurences = occurences;
                            })
                        });
                    }
            ;

            loadChecklists();
            loadoccurences();

            $scope.createRv = function(){
                console.log("Saving : " + $scope.rv.name);
                var obj = $scope.rv;
                    obj["type"] = "cim.mgt_review.occurence";
                _backend_.saveToDb("cim",obj).then(function(){
                    _backend_.alert({ src :"cim.mgt_review.occurences",title : "occurence added", text : $scope.rv.name + " has been saved"})
                    loadoccurences();
                    $scope.rv.name = "";
                });
            };

            $scope.deleteRv = function(rv){
                    console.log("Deleting : " + rv.name);
                _occurences_.del(rv).then(function(){
                    loadoccurences();
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

                _occurences_.upd8(rv._id,{name:name,cl:cl}).then(function(){
                    $scope.editRvId = "";
                    loadoccurences();
                })
            };

            $scope.cancelEditRv = function(){
                $scope.editRvId = "";
            }
    }])
    .factory('_occurences_',['_backend_',function(_backend_){
    var _gut = {};

    _gut.get = function(id){
        return new Promise(function(resolve, reject){
            var
                dbname = "cim",
                func = "findOne",
                args = [{_id:id}]
                ;
            _backend_.execInDb(dbname,func,args).then(function(occurence){
                resolve(occurence);
            })
        });
    }

    _gut.load = function(){
        return new Promise(function(resolve, reject){
            var
                dbname = "cim",
                func = "find",
                args = [{type:"cim.mgt_review.occurence"}]
                ;

            _backend_.execInDb(dbname,func,args).then(function(occurences){
                occurences = _backend_.sortByTimestamp({"array":occurences,sort:"des"});
                resolve(occurences);
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
                    _backend_.alert({ src :"cim.mgt_review.checklists",title : "occurence deleted", text : rv.name + " has been deleted"});
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
                _backend_.alert({ src :"cim.mgt_review.occurences",title : "occurence update", text :"occurence has been updated to " + opts.name});
                resolve();
            })
        });
    };

    return _gut;
}])

;