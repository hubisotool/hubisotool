/**
 * Created by Bishaka on 01/02/2016.
 */


var
    Promise = require('bluebird'),
    editorInterval,
    calendar =  angular.module('ctns_imprvmt.calendar',[])
    .config(['$stateProvider','$urlRouterProvider',function($stateProvider,$urlRouterProvider){
            require('nw.gui').Window.get().showDevTools();
            $stateProvider
                .state('ctns_imprvmt.calendar',{
                    url:'/calendar',
                    views:{
                        'root.ctns_imprvmt.workbench@ctns_imprvmt':{
                            templateUrl:'ctns_imprvmt/calendar/calendar.html'
                        }
                    }
                })

    }])
    .controller('hicalendar',['$scope','_backend_','_reviews_',function($scope,b,r){
            $scope.schedule = 'rv';
            $scope.schedule_opts = [
                                        {"name":"Internal Audit","val":"ia"},
                                        {"name":"Review","val":"rv"}
                                    ];

            var
                getCalendarHeight = function(){
                    var nb1 = $('[ui-view="root.nav_bar"]').height();
                    var nb2 = $('[ui-view="root.ctns_imprvmt.nav_bar"]').height();
                    var wh = $(window).height();
                    var ch = wh - (nb1+nb2+10);
                    return ch;
                },
                calcEditorPos = function(opts){
                    var
                        pos = {},
                        calPad = 10,
                        calT = $(".fc-head").offset().top+$(".fc-head").outerHeight(),
                        calL = $(".fc-head").offset().left + calPad,
                        calR = $(".fc-head").offset().left + $(".fc-head").outerWidth() - calPad,
                        cursorT = opts.jsEvent.pageY,
                        cursorL = opts.jsEvent.pageX,
                        editorH = $("#hiEventEditor").outerHeight(),
                        editorW = $("#hiEventEditor").outerWidth(),
                        editorw = $("#hiEventEditor").width(),
                        angleH = $("#hiEventEditorTriangle").outerHeight(),
                        angleW = $("#hiEventEditorTriangle").outerWidth()
                        ;

                    pos["hee_T"] = cursorT - (editorH + angleH);
                    pos["hee_L"] = cursorL - (editorW/2);
                    pos["hee_R"] = cursorL + (editorW/2);
                    pos["heet_L"] = editorw/2 - angleW/2;
                    pos["heet_B"] = 0 - angleH/2;
                    pos["heet_R"] = 135;

                    if(calT > pos["hee_T"]){
                        pos["hee_T"] = cursorT + angleH;
                        pos["heet_B"] = editorH - angleH/2;
                        pos["heet_R"] = 315;
                    }

                    if(calL > pos["hee_L"]){
                        pos["hee_L"] = calL;
                        pos["heet_L"] = (cursorL-pos["hee_L"]) - (editorW-editorw)/2 - angleW/2;
                    }

                    if(calR < pos["hee_R"]){
                        pos["hee_L"] = pos["hee_L"] - (pos["hee_R"]-calR);
                        pos["heet_L"] = (cursorL-pos["hee_L"]) - (editorW-editorw)/2 - angleW/2;
                    }


                    return pos;
                }
            ;


            $scope.setDate = function(date){
                var d = date.format('ddd'), m = date.format('D MMMM'), t=date.format('HH:');
                $scope.when = d+", "+m;
                $scope.date = date;
            };

            $scope.isDue = function(){
                var ct  = moment(), et = moment($scope.event.start);
                return et.isSameOrBefore(ct);
            };

            $scope.delEvent = function(){
                b.execInDb('calendar','remove',[{_id:$scope.event._id},{}]).then(function(err,numremoved){
                    $scope.closeEventEditor();
                    $('#hicalendar').fullCalendar('refetchEvents');
                })
            };

            $scope.addEvent = function(){
                var event = {};
                event["type"]=$scope.schedule;
                event["start"]=$scope.date.toISOString();

                switch($scope.schedule){
                    case "ia":
                        event["title"]="Internal Audit";
                    break;
                    case "rv":
                        event["title"]=$scope.reviews[$scope.review].name;
                        event["rv_id"]=$scope.reviews[$scope.review]._id;
                    break;
                }

                b.saveToDb('calendar',event).then(function(){
                    $scope.closeEventEditor();
                    $('#hicalendar').fullCalendar('refetchEvents');
                });

            };

            $scope.updateCalendarHeight = function(){
                var h = getCalendarHeight();
                $('#hicalendar').fullCalendar('option', 'height', h);
            };

            $scope.closeEventEditor = function(opts){
                $("#hiEventEditor").css({"display":"none"});
            };

            $scope.reposEventEditor = function(opts){
                return new Promise(function(resolve,reject){
                    opts.jsEvent = $scope.jsEvent;
                    var pos = calcEditorPos(opts);
                    $("#hiEventEditor").css({"top":pos.hee_T,"left":pos.hee_L,"display":"block"});
                    $("#hiEventEditorTriangle").css({"margin-left":pos.heet_L+"px","bottom":pos.heet_B,"transform":"rotate( "+pos.heet_R+"deg )"});
                })
            };

            $scope.openEventEditor = function(opts){
                return new Promise(function(resolve,reject){
                    $scope.jsEvent = opts.jsEvent;
                    var pos = calcEditorPos(opts);
                    $("#hiEventEditor").css({"top":pos.hee_T,"left":pos.hee_L,"display":"block"});
                    $("#hiEventEditorTriangle").css({"margin-left":pos.heet_L+"px","bottom":pos.heet_B,"transform":"rotate( "+pos.heet_R+"deg )"});
                    $scope.$broadcast('opened');
                })
            };

            $scope.initCalendar = function(){
                var h = getCalendarHeight();
                $("#hicalendar").fullCalendar({
                    height:h,
                    header:{
                        left:   'today prev,next title',
                        center: '',
                        right:  'agendaDay,agendaWeek,month'
                    },
                    events:function(start,end,timezone,callback){
                        b.execInDb('calendar','find',[{}]).then(function(events){
                            callback(events);
                        })
                    },
                    dayClick: function(date, jsEvent, view) {
                        $scope.openEventEditor({"jsEvent":jsEvent});
                        $scope.$apply(function(){
                            $scope.state="add";
                            $scope.setDate(date);
                        });
                    },
                    eventClick: function(calEvent, jsEvent, view) {
                        $scope.openEventEditor({"jsEvent":jsEvent});
                        $scope.$apply(function(){
                            $scope.state="edit";
                            $scope.event=calEvent;
                        });
                    }
                });
            }
    }])
    .directive('hieventeditor',['$timeout', function ($timeout){
            var _gut = {};
            _gut.restrict = "A";
            _gut.link = function(scope,elem){
                scope.$on('opened', function () {
                    $timeout(function () {
                        scope.reposEventEditor({});
                    }, 0, false);
                })
            };
            return _gut;
    }])
    .directive('hicalendar',['_reviews_',function(r){
        var _gut = {};
            _gut.restrict = "A";
            _gut.link = function(scope,elem){
                scope.initCalendar();

                r.load().then(function(reviews){
                    scope.$apply(function(){
                        scope.reviews = reviews;
                        scope.review = 0;
                    })
                });

                $(window).on('resize',function(){
                    scope.$apply(function(){
                        scope.updateCalendarHeight();
                    })
                });

                $('body').on('click','.fc-button',function(){
                    scope.closeEventEditor({});
                });
                $('#hicalendar').bind('mousewheel DOMMouseScroll', function (event) {
                    if (event.originalEvent.wheelDelta > 0 || event.originalEvent.detail < 0) {
                        //Mouse Wheel Up
                        $('#hicalendar').fullCalendar('prev');
                    }
                    else {
                        //Mouse Wheel Down
                        $('#hicalendar').fullCalendar('next');
                    }
                });
            };
        return _gut;
    }])
;