/**
 * Created by Bishaka on 23/10/2015.
 */

var
    hubisotool = angular.module('hubisotool',['ui.router','docs_n_records'])

        .config(['$stateProvider','$urlRouterProvider',function($stateProvider,$urlRouterProvider){
            $stateProvider
                .state('docs_n_records',{
                    url:'/docs_n_records',
                    views:{
                        'root.nav_bar':{
                            templateUrl:'nav_bar/nav_bar.html'
                        },
                        'root.workbench':{
                            templateUrl:'docs_n_records/docs_n_records.html'
                        },
                        'root.docs_n_records.nav_bar@docs_n_records':{
                            templateUrl:'docs_n_records/nav_bar/nav_bar.html'
                        }
                    }
                })
                .state('docs_n_records.settings',{
                    url:'/settings',
                    views:{
                       'root.docs_n_records.workbench':{
                           templateUrl:'docs_n_records/settings/settings.html'
                       }
                    }
                })

            $urlRouterProvider.otherwise('/docs_n_records');

        }])

;