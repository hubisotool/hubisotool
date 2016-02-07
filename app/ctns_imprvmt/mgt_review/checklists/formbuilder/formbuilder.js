/**
 * Created by Bishaka on 17/11/2015.
 */

var
    x2js = new X2JS(),
    formbuilder = angular.module('ctns_imprvmt.mgt_review.checklists.formbuilder',[])
    .config(['$stateProvider','$urlRouterProvider',function($stateProvider,$urlRouterProvider){
        $stateProvider
            .state('ctns_imprvmt.mgt_review.checklists.edit',{
                url:'/edit/:id',
                views:{
                    'root.ctns_imprvmt.mgt_review.workbench@ctns_imprvmt.mgt_review':{
                        templateUrl:'ctns_imprvmt/mgt_review/checklists/formbuilder/formbuilder.html'
                    }
                }
            })

    }])
    .controller('ctns_imprvmt.mgt_review.checklists.formbuilderCtrl',['$scope','$state','$stateParams','_checklists_',function($scope,$state,$stateParams,_checklists_){
            $scope.checklist = {};
            var
                id = $stateParams.id,
                loadChecklist = function(){
                    _checklists_.get(id).then(function(checklist){
                        $scope.$apply(function(){
                            $scope.checklist = checklist;
                        })
                    })
                }
            ;

            loadChecklist();

            $scope.fetchCl = function(){
                return _checklists_.get(id);
            };

            $scope.saveEditCl = function(){
                var opts = {name:$scope.checklist.name};
                _checklists_.upd8(id,opts);
                $state.transitionTo("ctns_imprvmt.mgt_review.checklists");
            };

            $scope.cancelEditCl = function(){
                $state.transitionTo("ctns_imprvmt.mgt_review.checklists");
            };

            $scope.upd8Form = function(form){
                var opts = {form:form};
                _checklists_.upd8(id,opts)
            }
    }])
    .directive('formBuildr',[function(){
        return{
            restrict:'A',
            link:function(scope,elem){
                scope.fetchCl().then(function(checklist){
                    console.log(JSON.stringify(checklist));
                    var form = checklist.form || [];
                    $('[id="root.ctns_imprvmt.mgt_review.checklists.checklist.formbuilder.form"]').formBuilder({
                        defaultFields:form.reverse()
                    });

                    $('[id="root.ctns_imprvmt.mgt_review.checklists.checklist.formbuilder.form"]').on('change',function(){
                        var data = $('[id="root.ctns_imprvmt.mgt_review.checklists.checklist.formbuilder.form"]').val(),
                            data_obj = x2js.xml_str2json(data),
                            data_arr_raw = [],
                            data_arr = [];
                            ;
                        if(data_obj){
                            data_arr_raw = data_arr_raw.concat(data_obj['form-template']['fields']['field']);
                        };

                        data_arr_raw.forEach(function(old_datum){
                            var old_keys = Object.keys(old_datum), new_datum = {};
                            old_keys.forEach(function(old_key){
                                var new_key = old_key.replace("_","");
                                new_datum[new_key] = old_datum[old_key];
                            })
                            data_arr.push(new_datum);
                        });

                        scope.upd8Form(data_arr);
                    });
                })


            }
        }
    }])
;