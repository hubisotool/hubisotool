/**
 * Created by Bishaka on 23/10/2015.
 */

var
    templates = angular.module('docs_n_records.templates',['backend'])
        .config(['$stateProvider','$urlRouterProvider',function($stateProvider,$urlRouterProvider){
            $stateProvider
                .state('docs_n_records.templates',{
                    url:'/templates',
                    views:{
                        'root.docs_n_records.workbench':{
                            templateUrl:'docs_n_records/templates/templates.html'
                        }
                    }
                })

        }])

    ;