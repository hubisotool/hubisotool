/**
 * Created by Bishaka on 30/10/2015.
 */


var
    Promise = require('bluebird'),
    pdf = angular.module('docs_n_records.exporters.pdf',[])

    .factory('docs_n_records.exporters.pdf.factory',[function(){
            var _gut = {};

            _gut["htmlToPdfMakeLayout"] = function(html){
                return new Promise(function(resolve,reject){
                    var data = $(html)
                    var layout = [];
                    $.each(data,function(idx){
                        //console.log("Idx["+idx+"] : " + Object.keys(data[idx]));
                        console.log("Idx["+idx+"] Type: " + data[idx]["nodeName"]);
                        if($(data[idx]).find("img").length > 0){
                            var img = $(data[idx]).find("img").attr("src");
                            layout.push({image:img,width:515});
                        }else if(data[idx]["nodeName"]==="TABLE"){
                            var body = [];
                            var widths = [];
                            $(data[idx]).find("tr").each(function(_row_idx,_row){
                                var row = []
                                $(_row).find('td').each(function(_cell_idx,_cell){
                                    var cell = $(_cell);
                                    widths[_cell_idx] = '*';
                                    var txt =  cell.text();
                                    var align = cell.prop('style').textAlign || "left";
                                    var colspan = cell.attr('colspan') || 1;

                                    row.push({text:txt,alignment:align,colSpan:colspan});

                                    console.log("Text : " + txt);
                                    console.log("Align : " + align);
                                    console.log("Colspan : " + colspan);
                                });
                                body.push(row)
                            })
                            console.log("found table : " + JSON.stringify(body));
                            layout.push({ table:{widths:widths,body:body} });
                        }
                        else{
                            var txt = $(data[idx]).text()
                            if($.isEmptyObject(txt)){
                                if(typeof layout[layout.length-1]["margin"] === 'undefined'){
                                    layout[layout.length-1]["margin"] = [0,0,0,20];
                                }else{
                                    layout[layout.length-1]["margin"][3] = 20;
                                }

                            }else{
                                var ml = parseInt($(data[idx]).prop('style').marginLeft.replace('px','')) || 0;
                                var align = $(data[idx]).prop('style').textAlign;
                                layout.push({text:txt, margin:[ml,0,0,0], alignment:align});
                            }
                        }
                    })
                    var docDefinition = { pageSize:'A4', content: layout };
                    console.log(JSON.stringify(docDefinition));
                    pdfMake.createPdf(docDefinition).download('optionalName.pdf');
                    resolve(layout);
                })
            };

            return _gut;
    }])
;