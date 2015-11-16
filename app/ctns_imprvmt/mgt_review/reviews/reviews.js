/**
 * Created by Bishaka on 16/11/2015.
 */
var
    reviews = angular.module('ctns_imprvmt.mgt_review.reviews',[])
    .config(['$stateProvider','$urlRouterProvider',function($stateProvider,$urlRouterProvider){
        $stateProvider
            .state('ctns_imprvmt.mgt_review.reviews',{
                url:'/reviews',
                views:{
                    'root.ctns_imprvmt.mgt_review.workbench@ctns_imprvmt.mgt_review':{
                        templateUrl:'ctns_imprvmt/mgt_review/reviews/reviews.html'
                    }
                }
            })

    }])
    .controller('ctns_imprvmt.mgt_review.reviewsCtrl',['$scope',function($scope){
            $scope.reviews = [
                {"name":"Follow up frm previus reviews"},
                {"name":"Status of corrective actions and required preventive actions"},
                {"name":"Reports from personnel"},
                {"name":"Environmental monitoring log sheets"}
            ]
    }])

    ;