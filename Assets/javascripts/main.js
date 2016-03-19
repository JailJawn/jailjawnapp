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

        var chart = AmCharts.makeChart("chartdiv", {
            "type": "serial",
            "theme": "light",
            "marginRight": 40,
            "marginLeft": 40,
            "autoMarginOffset": 20,
            "dataDateFormat": "YYYY-MM-DD",
            "valueAxes": [{
                "id": "v1",
                "axisAlpha": 0,
                "position": "left",
                "ignoreAxisWidth":true
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

        var pichart = AmCharts.makeChart("pichart", {
            "type": "pie",
            "startDuration": 0,
            "theme": "light",
            "addClassNames": true,
            "legend":{
                "position":"right",
                "marginRight":100,
                "autoMargins":false
            },
            "innerRadius": "30%",
            "defs": {
                "filter": [{
                    "id": "shadow",
                    "width": "200%",
                    "height": "200%",
                    "feOffset": {
                        "result": "offOut",
                        "in": "SourceAlpha",
                        "dx": 0,
                        "dy": 0
                    },
                    "feGaussianBlur": {
                        "result": "blurOut",
                        "in": "offOut",
                        "stdDeviation": 5
                    },
                    "feBlend": {
                        "in": "SourceGraphic",
                        "in2": "blurOut",
                        "mode": "normal"
                    }
                }]
            },
            "dataProvider": formatSexChart(firebaseData),
            "valueField": "Incarcerated",
            "titleField": "Gender",
            "export": {
                "enabled": true
            }
        });

        pichart.addListener("init", handleInit);

        pichart.addListener("rollOverSlice", function(e) {
            handleRollOver(e);
        });

        function handleInit(){
            pichart.legend.addListener("rollOverItem", handleRollOver);
        }

        function handleRollOver(e){
            var wedge = e.dataItem.wedge.node;
            wedge.parentNode.appendChild(wedge);
        }

    });

});

function formatDateChart(data){
    //type checking
    if(!data){
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

function formatSexChart(data){
    if(!data){
        return "error, data is undefined";
    }
    else if(typeof(data) !== "object"){
        return "error, argument should be an object";
    }
    else{
        //instantiate total males and females for increment
        var totalMale = 0, totalFemale = 0, total = 0, avgM = 0, avgF = 0;
        for(var prop in data){
            console.log(data[prop]["Total "]["Adult Male"]);
            totalMale += parseInt(data[prop]["Total "]["Adult Male"]);
            totalFemale += parseInt(data[prop]["Total "]["Adult Female"]);
            total++;
        }
        avgM = totalMale/total;
        avgF = totalFemale/total;
        return [
            {
                "Gender": "Male",
                "Incarcerated": Math.round(avgM)
            },
            {
                "Gender": "Female",
                "Incarcerated": Math.round(avgF)
            }
        ]
    }
}

