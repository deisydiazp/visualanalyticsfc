//http://bl.ocks.org/mbostock/1558011
if (!d3.chart)
    d3.chart = {};

d3.chart.parallelCoordinates = function () {
    var g;
    var data;
    var measure;
    var dispatch = d3.dispatch("on");
    var m = [30, 10, 10, 10];
    var width = 3000;
    var height = 800;
    var dataSelected;
    var typeSelected;
    var dimensions_new = ['sem24', 'sem25', 'sem26', 'sem27', 'sem28', 'sem29',
        'sem30', 'sem31', 'sem32', 'sem33', 'sem34', 'sem35',
        'sem36', 'sem37', 'sem38', 'sem39', 'sem40',
        'mes3', 'mes6', 'mes9', 'mes12'];

    var arrDimensions = {'sem24': 0, 'sem25': 1, 'sem26': 2, 'sem27': 3, 'sem28': 4, 'sem29': 5,
        'sem30': 6, 'sem31': 7, 'sem32': 8, 'sem33': 9, 'sem34': 10, 'sem35': 11,
        'sem36': 12, 'sem37': 13, 'sem38': 14, 'sem39': 15, 'sem40': 16,
        'mes0': 17, 'mes0_1': 18, 'mes0_2': 19, 'mes0_3': 20,
        'mes1': 21, 'mes1_1': 22, 'mes1_2': 23, 'mes1_3': 24,
        'mes2': 25, 'mes2_1': 26, 'mes2_2': 27, 'mes2_3': 28,
        'mes3': 29, 'mes3_1': 30, 'mes3_2': 31, 'mes3_3': 32,
        'mes4': 33, 'mes4_1': 34, 'mes4_2': 35, 'mes4_3': 36,
        'mes5': 37, 'mes5_1': 38, 'mes5_2': 39, 'mes5_3': 40,
        'mes6': 41, 'mes6_1': 42, 'mes6_2': 43, 'mes6_3': 44,
        'mes7': 45, 'mes7_1': 46, 'mes7_2': 47, 'mes7_3': 48,
        'mes8': 49, 'mes8_1': 50, 'mes8_2': 51, 'mes8_3': 52,
        'mes9': 53, 'mes9_1': 54, 'mes9_2': 55, 'mes9_3': 56,
        'mes10': 57, 'mes10_1': 58, 'mes10_2': 59, 'mes10_3': 60,
        'mes11': 61, 'mes11_1': 62, 'mes11_2': 63, 'mes11_3': 64,
        'mes12': 65};

    function chart(container) {
        g = container;

        var rectFenton = g.append("g")
                .attr("id", "rectFenton");
        rectFenton.append("rect");
        rectFenton.append("text");

        var rectOMS = g.append("g")
                .attr("id", "rectOms");
        rectOMS.append("rect");
        rectOMS.append("text");

        g.append("g")
                .attr("id", "g_background");

        g.append("g")
                .attr("id", "g_foreground");

        g.append("g")
                .attr("id", "g_pathEstandar");

        width = width - m[1] - m[3],
                height = height - m[0] - m[2];

        update();
    }
    chart.update = update;
    chart.updateSelected = updateSelected;

    function update() {

        var xScale = d3.scale.ordinal().rangePoints([0, width], .5);
        var yScale = {};
        var line = d3.svg.line().defined(function (d) {
            return d[1] != null;
        });
        var axis = d3.svg.axis().orient("left");
        var background;
        var foreground;
        var nullOffset = false;

        // Extract the list of dimensions and create a scale for each.
        xScale.domain(dimensions = d3.keys(arrDimensions).filter(function (d) {
            return d != "CODE" && (yScale[d] = d3.scale.linear()
                    .domain(dominio(d, data.limitesMinimos, data.limitesMaximos))
                    .range([height, 0]));
        }));

        g.select("#rectFenton").select("text")
                .text("Fenton")
                .attr("x", 10)
                .attr("y", 50)
                .style("font-size", "12px");

        g.select("#rectOms").select("text")
                .text("OMS")
                .attr("x", xScale("sem40") + 45)
                .attr("y", 50)
                .style("font-size", "12px");

        var widthRectFenton = (xScale("sem40") - xScale("sem24")) + 40;
        g.select("#rectFenton").select("rect")
                .attr("x", 0)
                .attr("y", 35)
                .attr('width', widthRectFenton)
                .attr('height', 40)
                .attr('fill', "#bdbdbd");

        var widthRectOms = (xScale("mes12") - xScale("sem40")) + 30;
        g.select("#rectOms").select("rect")
                .attr("x", (xScale("sem40") + 30))
                .attr("y", 35)
                .attr('width', widthRectOms)
                .attr('height', 40)
                .attr('fill', "#A4A4A4");


        // Add grey background lines for context.
        g.select("#g_background")
                .attr("class", "background")
                .attr("transform", "translate(30,80)");

        background = g.select("#g_background").selectAll("path")
                .data(data.listaMedidas)
                .attr("d", path)
                .attr("id", function (d) {
                    return d.CODE;
                });

        background.enter()
                .append("path")
                .attr("d", path)
                .attr("id", function (d) {
                    return d.CODE;
                });

        background.exit().remove();

        // Add blue foreground lines for focus.
        g.select("#g_foreground")
                .attr("class", "foreground")
                .attr("transform", "translate(30,80)");

        foreground = g.select("#g_foreground").selectAll("path")
                .data(data.listaMedidas)
                .attr("d", path)
                .attr("id", function (d) {
                    return d.CODE;
                });

        g.select("#g_foreground").selectAll("title")
                .data(data.listaMedidas)
                .text(function (d) {
                    return "Código: " + d.CODE;
                })

        foreground.enter()
                .append("path")
                .attr("d", path)
                .attr("id", function (d) {
                    return d.CODE;
                })
                .attr("class", "seleccionado")
                .append("title")
                .text(function (d) {
                    return "Código: " + d.CODE;
                });

        foreground.exit().remove();

        g.select("#g_pathEstandar")
                .attr("transform", "translate(30,80)");

        var pathEstandar = g.select("#g_pathEstandar").selectAll('path')
                .data(data.listaMedidasEstandar)
                .attr("d", path)
                .attr("id", function (d) {
                    return d.CODE;
                });

        pathEstandar.enter()
                .append('path')
                .attr("d", path)
                .attr("id", function (d) {
                    return d.CODE;
                });

        // Add a group element for each dimension.
        var gDimension = g.selectAll(".dimension")
                .data(dimensions_new)
                .attr("class", "dimension")
                .attr("transform", function (d) {
                    return "translate(" + (xScale(d) + 30) + ",80)";
                });

        gDimension.enter().append("g")
                .attr("class", "dimension")
                .attr("transform", function (d) {
                    return "translate(" + (xScale(d) + 30) + ",80)";
                });

        gDimension.exit().remove();


        axisDim = gDimension.selectAll(".axis")
        axisDim.remove();

        // Add an axis and title.
        gDimension.append("g")
                .attr("class", "axis")
                .each(function (d) {
                    d3.select(this).call(axis.scale(yScale[d]));
                })
                .append("text")
                .attr("text-anchor", "middle")
                .attr("y", -10)
                .attr("fill", "#FFF")
                .text(String);


        brushDim = gDimension.selectAll(".brush")
        brushDim.remove();
        // Add and store a brush for each axis.
        gDimension.append("g")
                .attr("class", "brush")
                .each(
                        function (d) {
                            d3.select(this).call(yScale[d].brush = d3.svg.brush().y(yScale[d]).on("brush", brush));
                        })
                .selectAll("rect")
                .attr("x", -8)
                .attr("width", 16);


        function brush() {
            var actives = dimensions_new.filter(function (p) {
                return !yScale[p].brush.empty();
            }),
                    extents = actives.map(function (p) {
                        return yScale[p].brush.extent();
                    });

            foreground.style("display", function (d) {
                if (actives.every(function (p, i) {
                    return extents[i][0] <= d[p] && d[p] <= extents[i][1];
                })) {
                    return null;

                } else {
                    return "none";
                }
                ;
            });

            foreground.attr("class", function (d) {
                if (actives.every(function (p, i) {
                    return extents[i][0] <= d[p] && d[p] <= extents[i][1];
                })) {

                    return "seleccionado";

                } else {

                    return "";

                }
                ;
            });

            d3.select('#g_foreground').selectAll('path[display="none"]').attr('class', '');
            d3.select('#totalSelect').text("Selección: " + d3.selectAll(".seleccionado")[0].length);
        }


        // Returns the path for a given data point.
        function path(d) {
            return line(dimensions_new.map(function (p) {
                // check for undefined values
                if (d[p] == "0" && d.CODE != 'des_0')
                    return (nullOffset) ? [xScale(p), yScale[p].range()[0] + 30] : [xScale(p), null];

                return [xScale(p), yScale[p](d[p])];
            }));
        }
        ;


        function dominio(d, arrMin, arrMax) {
            if (d == 'sem24') {
                return [arrMin[0], arrMax[0]];
            } else if (d == 'sem25') {
                return [arrMin[1], arrMax[1]];
            } else if (d == 'sem26') {
                return [arrMin[2], arrMax[2]];
            } else if (d == 'sem27') {
                return [arrMin[3], arrMax[3]];
            } else if (d == 'sem28') {
                return [arrMin[4], arrMax[4]];
            } else if (d == 'sem29') {
                return [arrMin[5], arrMax[5]];
            } else if (d == 'sem30') {
                return [arrMin[6], arrMax[6]];
            } else if (d == 'sem31') {
                return [arrMin[7], arrMax[7]];
            } else if (d == 'sem32') {
                return [arrMin[8], arrMax[8]];
            } else if (d == 'sem33') {
                return [arrMin[9], arrMax[9]];
            } else if (d == 'sem34') {
                return [arrMin[10], arrMax[10]];
            } else if (d == 'sem35') {
                return [arrMin[11], arrMax[11]];
            } else if (d == 'sem36') {
                return [arrMin[12], arrMax[12]];
            } else if (d == 'sem37') {
                return [arrMin[13], arrMax[13]];
            } else if (d == 'sem38') {
                return [arrMin[14], arrMax[14]];
            } else if (d == 'sem39') {
                return [arrMin[15], arrMax[15]];
            } else if (d == 'sem40') {
                return [arrMin[16], arrMax[16]];
            } else if (d == 'mes3') {
                return [arrMin[17], arrMax[17]];
            } else if (d == 'mes6') {
                return [arrMin[18], arrMax[18]];
            } else if (d == 'mes9') {
                return [arrMin[19], arrMax[19]];
            } else if (d == 'mes12') {
                return [arrMin[20], arrMax[20]];
            } else {
                //return d3.extent(arrMin, arrMax);
                return [1000, 2000];
            }
        }
        ;
    }


    function updateSelected() {

        var conteo = 0;

        var filtered = data.listaMedidas.filter(function (d) {

            var dat1 = true;
            var dat2 = [];
            for (var i = 0; i < dataSelected.length; i++) {
                if (dat2[typeSelected+'_' + dataSelected[i].source.split('_')[0]]) {
                    dat2[typeSelected+'_' + dataSelected[i].source.split('_')[0]] = dat2[typeSelected+'_' + dataSelected[i].source.split('_')[0]] || d[typeSelected+'_' + dataSelected[i].source.split('_')[0]] == dataSelected[i].source.split('_')[1];
                } else {
                    dat2[typeSelected+'_' + dataSelected[i].source.split('_')[0]] = d[typeSelected+'_' + dataSelected[i].source.split('_')[0]] == dataSelected[i].source.split('_')[1];
                }
                if (dat2[typeSelected+'_' + dataSelected[i].target.split('_')[0]]) {
                    dat2[typeSelected+'_' + dataSelected[i].target.split('_')[0]] = dat2[typeSelected+'_' + dataSelected[i].target.split('_')[0]] || d[typeSelected+'_' + dataSelected[i].target.split('_')[0]] == dataSelected[i].target.split('_')[1];
                } else {
                    dat2[typeSelected+'_' + dataSelected[i].target.split('_')[0]] = d[typeSelected+'_' + dataSelected[i].target.split('_')[0]] == dataSelected[i].target.split('_')[1];
                }
            }


            for (var m in dat2) {
                dat1 = dat1 && dat2[m];
            }

            if (dat1) {
                conteo++;
                console.log(conteo);
                return d;
            }
        });

        var foreground = g.select("#g_foreground").selectAll('path');
        foreground.attr("class", function (d) {
            for (var i = 0; i < filtered.length; i++) {
                if (d.CODE == filtered[i].CODE) {
                    return "seleccionado";
                }
            }
            return "";
        });

        foreground.attr("display", function (d) {
            for (var i = 0; i < filtered.length; i++) {
                if (d.CODE == filtered[i].CODE) {
                    return null;
                }
            }
            return "none";
        });


        d3.select('#totalSelect').text("Selección: " + d3.selectAll(".seleccionado")[0].length);
    }

    chart.data = function (value) {
        if (!arguments.length)
            return data;
        data = value;
        return chart;
    }

    chart.measure = function (value) {
        if (!arguments.length)
            return measure;
        measure = value;
        return chart;
    }

    chart.dataSelected = function (value,type) {
        if (!arguments.length)
            return dataSelected;
        dataSelected = value;
        typeSelected=type;
        return chart;
    }


    return d3.rebind(chart, dispatch, "on");

}

