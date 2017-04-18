"use strict";
$(document).ready(function() {
    var data;
    $.get('http://jailjawnapi.herokuapp.com/all')
        .done(function (res) 
              try{
                data = JSON.parse(res);
              }catch(e){
                console.log(data);
                console.log(e);
                data = res;
              }

            var chart = AmCharts.makeChart("chartdiv", {
                "type": "serial",
                "theme": "light",
                "marginRight": 40,
                "marginLeft": 40,
                "autoMarginOffset": 20,
                "dataDateFormat": "YYYY-MM-DD",
               "titles": [{
             "text": "Daily Census between December 2013 and Today"
             }],
                "valueAxes": [{
                    "id": "v1",
                    "axisAlpha": 0,
                    "position": "left",
                    "ignoreAxisWidth": true
                }],
                "valueAxes": [{
                 "position": "left",
                 "axisAlpha": 0,
                 "dashLength": 1,
                 "offset": 15,
                 "title": "Prison Population "
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
                    "balloon": {
                        "drop": true,
                        "adjustBorderColor": false,
                        "color": "#ffffff"
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
                    "oppositeAxis": false,
                    "offset": 30,
                    "scrollbarHeight": 80,
                    "backgroundAlpha": 0,
                    "selectedBackgroundAlpha": 0.1,
                    "selectedBackgroundColor": "#888888",
                    "graphFillAlpha": 0,
                    "graphLineAlpha": 0.5,
                    "selectedGraphFillAlpha": 0,
                    "selectedGraphLineAlpha": 1,
                    "autoGridCount": true,
                    "color": "#AAAAAA"
                },
                "chartCursor": {
                    "pan": true,
                    "valueLineEnabled": true,
                    "valueLineBalloonEnabled": true,
                    "cursorAlpha": 1,
                    "cursorColor": "#258cbb",
                    "limitToGraph": "g1",
                    "valueLineAlpha": 0.2
                },
                "valueScrollbar": {
                    "oppositeAxis": false,
                    "offset": 50,
                    "scrollbarHeight": 10
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
                "dataProvider": formatDateChart(data)
            });

            chart.addListener("rendered", zoomChart);

            zoomChart();

            function zoomChart() {
                chart.zoomToIndexes(chart.dataProvider.length - 40, chart.dataProvider.length - 1);
            }

            //end line chart

            //pie chart
            var pichart = AmCharts.makeChart("pichart", {
                "type": "pie",
                "startDuration": 0,
                "theme": "light",
                "addClassNames": true,
                "legend": {
                    "position": "right",
                    "marginRight": 100,
                    "autoMargins": false
                },
                "titles": [{
                "text": "Average Census between December 2013 and Today"
                }],
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
                "dataProvider": formatSexChart(data),
                "valueField": "Incarcerated",
                "titleField": "Gender",
                "export": {
                    "enabled": true
                }
            });

            pichart.addListener("init", handleInit);

            pichart.addListener("rollOverSlice", function (e) {
                handleRollOver(e);
            });

            function handleInit() {
                pichart.legend.addListener("rollOverItem", handleRollOver);
            }

            function handleRollOver(e) {
                var wedge = e.dataItem.wedge.node;
                wedge.parentNode.appendChild(wedge);
            }

            //end pie chart

            var prisonChart = AmCharts.makeChart("prisonchart", {
                type: "stock",
                theme: "light",
                pathToImages: "//cdn.amcharts.com/lib/3/images/",
                dataSets: formatPrisonData(data),
                panels: [{
                     "titles": [{
                     "text": "Prison populations by facility, over time"
                    }],
                    /*title: 
                    "Prison populations by facility, over time",*/
                    stockGraphs: [{
                        valueField: "inmates",
                        comparable: true
                    }],
                    stockLegend: {}
                }],
                panelsSettings: {
                    recalculateToPercents: "never"
                },
                chartCursorSettings: {
                    valueLineEnabled: true,
                    valueLineBalloonEnabled: true
                },
                dataSetSelector: {
                    position: "left"
                },
                periodSelector: {
                    position: "left",
                    inputFieldsEnabled: false,
                    periods: [{
                        period: "DD",
                        count: 10,
                        label: "10 days"
                    }, {
                        period: "MM",
                        count: 1,
                        label: "1 month"
                    }, {
                        period: "YYYY",
                        count: 1,
                        label: "1 year",
                        selected: true
                    }, {
                        period: "YTD",
                        label: "YTD"
                    }, {
                        period: "MAX",
                        label: "MAX"
                    }]
                }
            });
        });
});
//Formats chart for all-time prison info
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
        var formatted = new Array;
        //iterate through the data
        for(var prop in data){
            // send each object literal to the formatted array
            if(data[prop]["Total "]){
                formatted.push({
                    "date": prop,
                    "value": data[prop]["Total "]["Juvenile Male"]
                    //currently the API displays total as "Juvenile Male", this will be fixed in future iterations
                });
            }
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
            if(data[prop]["Total "]){
                totalMale += parseInt(data[prop]["Total "]["Adult Male"]);
                totalFemale += parseInt(data[prop]["Total "]["Adult Female"]);
                total++;
            }
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

function separatePrisons(data){
    if(!data){
        return "Error, data is undefined"
    }
    else if(typeof(data) !== "object"){
        return "error, data should be an object"
    }else{
        var prisons = {};
        /*
         The JavaScript Object prototype doesn't include an iterator method.
         It does include the keys() method which take an object as an argument and returns
         the keys.

         Arrays have iterative methods like .forEach, .map, and to a lesser extent: .every and .filter

         JavaScript object literals are kind of like associative arrays, maps, or key-value pairs
         */
        Object.keys(data).forEach(function(key){  //Iterate through each value in the data set (each value is an object that contains an object)
            Object.keys(data[key]).forEach(function(prop){ //Iterate through each value's value (again, each is an object)
                if(!prisons.hasOwnProperty(prop)){ //If prisons doesn't have a property that is equal to the name of a prison, make it a property
                    prisons[prop] = [{
                        date: new Date(key),
                        inmates: data[key][prop]["Total Count"]
                    }]
                }else{//else add a new object literal to the end of the array
                    prisons[prop].push({
                        date: new Date(key),
                        inmates: data[key][prop]["Total Count"]
                    })
                }
            })
        });
        return prisons;
    }
}

function formatPrisonData(data){
    var prisons = separatePrisons(data);
    var datasets = new Array;
    for(var prop in prisons){
        datasets.push({
            title: prop,
            fieldMappings: [{
                fromField: "inmates",
                toField: "inmates"
            }],
            dataProvider: prisons[prop],
            categoryField: "date"
        })
    }
    return datasets;
}
