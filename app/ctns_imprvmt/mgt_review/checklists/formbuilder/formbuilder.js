/**
 * Created by Bishaka on 17/11/2015.
 */

var
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
                    var
                        form = checklist.form || "n/a",
                        formbuilder
                    ;
                    if(form === "n/a"){
                        formbuilder = new Formbuilder({
                            selector: '[id="root.ctns_imprvmt.mgt_review.checklists.checklist.formbuilder.form"]'
                        });
                    }else{
                        console.log(form.fields);
                        formbuilder = new Formbuilder({
                            selector: '[id="root.ctns_imprvmt.mgt_review.checklists.checklist.formbuilder.form"]',
                            bootstrapData:form.fields
                        });
                    }
                    formbuilder.on('save', function(payload){
                        payload = JSON.parse(payload);
                        scope.upd8Form(payload)
                    })
                })
            }
        }
    }])
;