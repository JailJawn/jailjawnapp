"use strict";
// Make a new firebase object with our firebase URL, instantiate data variable
var firebase = new Firebase("https://burning-heat-7610.firebaseio.com/");
//document.ready event handler (eg when the document is ready)
$(document).ready(function() {
    var firebaseData = "";
    //firebase event handler, when it receives a value do...
    firebase.on("value", function (snapshot) {
        //assign the data from firebase to a  variable
        firebaseData = snapshot.val();
        console.log(formatDateChart(firebaseData));
        console.log(firebaseData);

        var chart = AmCharts.makeChart("chartdiv", {
            "type": "serial",
            "theme": "light",
            "titles": [{
            "text": "Daily Census between December 2013 and Today"
            }],
            "marginRight": 40,
            "marginLeft": 40,
            "autoMarginOffset": 20,
            "dataDateFormat": "YYYY-MM-DD",
            /*"valueAxes": [{
                "id": "v1",
                "axisAlpha": 0,
                "position": "left",
                "ignoreAxisWidth":true
            }],
            */
            "valueAxes": [{
                "position": "left",
                "axisAlpha": 0,
                "dashLength": 1,
                "offset": 15,
                "title": "Total Number of Inmates "
            }, {
                "axisAlpha": 0,
                "dashLength": 1,
                "offset": -100,
                "position": "bottom",
                "title": "Time Length",
                
            }],
            "balloon": {
                "borderThickness": 1,
                "shadowAlpha": 0
            },
            "graphs": [{
                "id": "g1",
                "balloon":{
                    "drop":true,
                    "adjustBorderColor":false,
                    "color":"#ffffff"
                },
                "bullet": "round",
                "bulletBorderAlpha": 1,
                "bulletColor": "#FFFFFF",
                "bulletSize": 5,
                "hideBulletsCount": 50,
                "lineThickness": 2,
                "title": "red line",
                "useLineColorForBulletBorder": true,
                "valueField": "value",
                "valueAxis": "Amount",
                "balloonText": "<span style='font-size:18px;'>[[value]]</span>"
            }],
            "chartScrollbar": {
                "graph": "g1",
                "oppositeAxis":false,
                "offset":30,
                "scrollbarHeight": 80,
                "backgroundAlpha": 0,
                "selectedBackgroundAlpha": 0.1,
                "selectedBackgroundColor": "#888888",
                "graphFillAlpha": 0,
                "graphLineAlpha": 0.5,
                "selectedGraphFillAlpha": 0,
                "selectedGraphLineAlpha": 1,
                "autoGridCount":true,
                "color":"#AAAAAA"
            },
            "chartCursor": {
                "pan": true,
                "valueLineEnabled": true,
                "valueLineBalloonEnabled": true,
                "cursorAlpha":1,
                "cursorColor":"#258cbb",
                "limitToGraph":"g1",
                "valueLineAlpha":0.2
            },
            "valueScrollbar":{
                "oppositeAxis":false,
                "offset":50,
                "scrollbarHeight":10
            },
            "categoryField": "date",
            "categoryAxis": {
                "parseDates": true,
                "dashLength": 1,
                "minorGridEnabled": true
            },
            "export": {
                "enabled": true
            },
            "dataProvider": formatDateChart(firebaseData)
        });

        chart.addListener("rendered", zoomChart);

        zoomChart();

        function zoomChart() {
            chart.zoomToIndexes(chart.dataProvider.length - 40, chart.dataProvider.length - 1);
        }
    });

});

function formatDateChart(data){
    //type checking
    if(data === "undefined"){
        return "error, data is undefined";
    }
    else if(typeof(data) !== "object"){
        return "error, argument should be an object";
    }
    else{
        //instantiate array
        var formatted = [];
        //iterate through the data
        for(var prop in data){
            // send each object literal to the formatted array
            formatted.push({
                "date": prop,
                "value": data[prop]["Total "]["Juvenile Male"]
                //currently the API displays total as "Juvenile Male", this will be fixed in future iterations
            });
        }
        //return array
        return formatted;
    }
}

