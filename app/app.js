/**
 * Created by Bishaka on 23/10/2015.
 */

var
    hubisotool = angular.module('hubisotool',['ui.router','ui.layout','cfp.hotkeys','docs_n_records','ctns_imprvmt','logger','mainNav','updater'])
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
                    'root.docs_n_records.workbench@docs_n_records':{
                        templateUrl:'docs_n_records/master_list/master_list.html'
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
            .state('docs_n_records.master_list',{
                url:'/master_list',
                views:{
                    'root.docs_n_records.workbench':{
                        templateUrl:'docs_n_records/master_list/master_list.html'
                    }
                }
            })
            .state('docs_n_records.master_list_edit',{
                url:'/master_list/edit/{cat}/{docId}?doc',
                views:{
                    'root.docs_n_records.workbench':{
                        templateUrl:'docs_n_records/master_list/edit/edit.html'
                    }
                }
            })
        $urlRouterProvider.otherwise('/docs_n_records');

    }])
    .controller('appCtrl',['$scope','hotkeys','$state',function($scope,hotkeys,$state){

            if($state.current.name!=="updater"){
                //require('nw.gui').Window.get().showDevTools();
            }

            console.log("appCtrl registered!");
            hotkeys.bindTo($scope)
                .add({
                    combo: 'ctrl+n',
                    description: 'Open a new window',
                    callback: function() {
                        require('nw.gui').Window.open('shell.html');
                    }
                })
    }])
;