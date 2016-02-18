/**
 * Created by Bishaka on 26/10/2015.
 */

var
    ml_edit = angular.module('docs_n_records.master_list.edit',['backend'])

    .controller('rootDnrMlEditCtrl',['$scope','$stateParams','_backend_','hotkeys','docs_n_records.exporters.pdf.factory','logger','editLogSrc',function($scope,$stateParams,_backend_,hotkeys,pdfExporter,log,logSrc){
        $scope.cat = $stateParams.cat;
        $scope.docId = $stateParams.docId;

        $scope.savePdf = function(){
            var content = $('[id="root.docs_n_records.master_list.edit.editor"]').summernote('code');
            pdfExporter.htmlToPdfMakeLayout({html:content,name:$scope.doc.name});
        }

         //shortcuts
        hotkeys.bindTo($scope)
        .add({
            combo: 'ctrl+s',
            allowIn: ['INPUT', 'SELECT', 'TEXTAREA'],
            description: 'Save doc content as pdf',
            callback: function() {
                var content = $('[id="root.docs_n_records.master_list.edit.editor"]').code();
                pdfExporter.htmlToPdfMakeLayout({html:content,name:$scope.doc.name});
            }
        })

        //$scope.doc = JSON.parse($stateParams.doc);
            $scope.loadDoc = function(id) {
            log.debug({src:logSrc,diagId:"rootDnrMlEditCtrl::loadDoc",msg:"Executing dnr.ml.doc.load() with id : " + id });
            _backend_["dnr"]["ml"]["doc"].load(id)
                .then(function (doc) {
                    log.debug({src:logSrc,diagId:"rootDnrMlEditCtrl::loadDoc",msg:"Finished Executing dnr.ml.doc.load() got doc : " + doc.name });
                    $scope.$apply(function(){
                        $scope.doc = doc;
                    })
                    log.debug({src:logSrc,diagId:"rootDnrMlEditCtrl::loadDoc",msg:"Broadcasting docLoaded event with content : " + doc.content});
                    $scope.$broadcast('docLoaded',doc.content);
                });
        };

        $scope.updateDocName = function(id,name){
            _backend_.execInDb("dnr","update",[{"_id":id},{$set:{name:name}},{multi:true}])
            .then(function(numReplaced){
              console.log("Number of Docs Updated : " + numReplaced)
            })
        };

        $scope.updateDocContent = function(id,content){
            _backend_.execInDb("dnr","update",[{"_id":id},{$set:{content:content}},{multi:true}])
                .then(function(numReplaced){
                    console.log("Number of Docs Updated : " + numReplaced)
                })
        };


        $scope.setupScrollbar = function(newH){
            //$(".note-editable").niceScroll({cursorwidth:7});
        };

        $scope.setupEditor = function(newH){
            var editorH = newH - parseInt($('[id="root.docs_n_records.master_list.edit.box.title"]').css("height"))-72;
            console.log("Title Height : " + newH)
            console.log("Editor Height : " + editorH)
            $scope.setupScrollbar(newH);
        };

        $scope.resizeDnrMlEdit = function(){
            var winH = $(window).height();
            var newH = winH-($("[ui-view='root.nav_bar']").height()+$("[ui-view='root.docs_n_records.nav_bar']").height())-20;
            $scope.style = {
                "height":newH+"px"
            };

            $scope.setupEditor(newH);
        };
    }])
    .factory('editLogSrc',[function(){
        var logSrc="";
        try{
            throw new Error();
        }catch(err){
            var regex = /\(.*\)/,
                match = regex.exec(err.stack),
                filename = match[0].replace("(","").replace(")","");
            logSrc = filename;
        }
        return logSrc;
    }])
    .directive('rootDnrMlEditWinRsz',[function(){
        return{
            restrict:'A',
            link:function(scope,elem){
                scope.resizeDnrMlEdit();
                $(window).on('resize',function(){
                    scope.resizeDnrMlEdit();
                    scope.$apply();
                })
            }
        }
    }])

    .directive('mlDocName',[function(){
        return{
            restrict:'A',
            link:function(scope,elem){
                $(document).on("change","[class~='root.docs_n_records.master_list.edit.doc.name']",function(){
                    scope.updateDocName(scope.doc["_id"],scope.doc.name)
                })
            }
        }
    }])

    .directive('mlDocEditor',['logger','editLogSrc',function(log,logSrc){
        return{
            restrict:'A',
            link:function($scope,elem){
                $scope.$on('docLoaded',function(e,content){
                    log.debug({src:logSrc,diagId:"mlDocEditor::link",msg:"Recieved docLoaded event"});
                    log.debug({src:logSrc,diagId:"mlDocEditor::link",msg:"Setting editor content : " + content});
                    $('[id="root.docs_n_records.master_list.edit.editor"]').summernote('code', content);
                    log.debug({src:logSrc,diagId:"mlDocEditor::link",msg:"Finished Setting editor content"});
                });
                var setupEditor = function(){
                    log.debug({src:logSrc,diagId:"mlDocEditor::link",msg:"Setting up editor"});
                    var winH = $(window).height();
                    var newH = winH-($("[ui-view='root.nav_bar']").height()+$("[ui-view='root.docs_n_records.nav_bar']").height())-20;
                    var editorH = newH - parseInt($('[id="root.docs_n_records.master_list.edit.box.title"]').css("height"))-70;
                    $('[id="root.docs_n_records.master_list.edit.editor"]').summernote({
                        minHeight:1165,
                        focus: true,
                        callbacks:{
                            onInit:function(){
                                $scope.loadDoc($scope.docId);
                                $('[data-hubiso-module="root.docs_n_records.master_list.edit"] [id="root.docs_n_records.master_list.edit.box.editor"] .note-editing-area').css('height',editorH);
                                $(window).on('resize',function(){
                                    var winH = $(window).height();
                                    var newH = winH-($("[ui-view='root.nav_bar']").height()+$("[ui-view='root.docs_n_records.nav_bar']").height())-20;
                                    var editorH = newH - parseInt($('[id="root.docs_n_records.master_list.edit.box.title"]').css("height"))-70;
                                    $('[data-hubiso-module="root.docs_n_records.master_list.edit"] [id="root.docs_n_records.master_list.edit.box.editor"] .note-editing-area').css('height',editorH);
                                });
                            },
                            onChange: function(contents, $editable) {
                                $scope.updateDocContent($scope.docId,contents);
                            }
                        },
                        toolbar:[
                            [
                                'style',['style']
                            ],
                            [
                                'font_style',['bold','italic','underline','strikethrough','clear']
                            ],
                            [
                                'font_size',['fontsize']
                            ],
                            [
                                'font_color',['color']
                            ],
                            [
                                'layout_p',['ul','ol','paragraph']
                            ],
                            [
                                'height_p',['height']
                            ],
                            [
                                'table',['table']
                            ],
                            [
                                'insert',['link','picture','hr']
                            ],
                            [
                                'misc',['codeview','undo','redo']
                            ],
                            [
                                'help',['help']
                            ]
                        ]
                    });
                }
                setupEditor();
            }
        }
    }])

;