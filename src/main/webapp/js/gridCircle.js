if (!d3.chart)
    d3.chart = {};

d3.chart.gridCircle = function () {

    var g;
    var data;
    var width;
    var height;
    var labelVariable;
    var nodeHash = {};
    var pathSelected = [];
    var nodes;
    var labelsY = [];
    var dataOrigin;
    var typeOrigin;
    var dataSelected;
    var typeSelected;
    

    var dispatch = d3.dispatch(chart, "filter");

    function chart(container) {

        g = container;

        g.append("g")
                .attr("id", "g_background_ali")
                .attr("transform", "translate(80,50)");

        g.append("g")
                .attr("id", "g_foreground_ali")
                .attr("transform", "translate(80,50)");

        var moveX = 0;
        var moveY = 0;
        for (x in nodes) {
            nodeHash[nodes[x].id] = nodes[x];
            nodes[x].x = moveX;
            nodes[x].y = moveY * 100;

            if (moveY < labelsY.length - 1) {
                moveY++;
            } else {
                moveY = 0;
                moveX = moveX + 200;
            }
        }

        g.append("g").attr("id", "arcG").attr("transform", "translate(80,50)");
        var textX = g.append("g").attr("transform", "translate(80,400)");
        var textY = g.append("g").attr("transform", "translate(0,50)");

        var arrX = ["sem40", "mes3", "mes6", "mes9", "mes12"];
        for (var i = 0; i < arrX.length; i++) {
            textX.append("text")
                    .attr("x", i * 200)
                    .attr("dx", "-1em")
                    .text(arrX[i]);
        }

        for (var i = 0; i < labelsY.length; i++) {
            textY.append("text")
                    .attr("y", i * 100)
                    .attr("dy", ".5em")
                    .text(labelsY[i]);
        }

        update();
    }
    chart.update = update;

    function update() {

        for (x in data) {
            data[x].source = nodeHash[data[x].source];
            data[x].target = nodeHash[data[x].target];
        }

        var wScale = d3.scale.linear()
                .domain([d3.min(data, function (d) {
                        return d.weight
                    }), d3.max(data, function (d) {
                        return d.weight
                    })])
                .range([1, 50]);

        var glines = g.select("#arcG");

        // Add grey background lines for context.
        g.select("#g_background_ali")
                .attr("class", "background");

        var background = g.select("#g_background_ali").selectAll("path")
                .data(data.map(function (d) {
                    return d;
                }))
                .style("stroke-width", function (d) {
                    return wScale(d.weight)
                })
                .attr("d", path);

        background.enter()
                .append("path")
                .style("stroke-width", function (d) {
                    return wScale(d.weight)
                })
                .attr("d", path);

        background.on("click", function (d) {
            var obj = {source: d.source.id, target: d.target.id};
            pathSelected.push(obj);
            g.select('#g_foreground_ali').select('#' + d.source.id + d.target.id).style('display', null);
            g.select('#g_foreground_ali').select('#' + d.source.id + d.target.id).attr('class', 'selected');
            dispatch.filter(pathSelected)
        });

        background.exit().remove();

        // Add blue foreground lines for focus.
        g.select("#g_foreground_ali")
                .attr("class", "foreground");

        var foreground = g.select("#g_foreground_ali").selectAll("path")
                .data(data.map(function (d) {
                    return d;
                }))
                .style("stroke-width", function (d) {
                    return wScale(d.weight)
                })
                .attr("d", path)
                .attr("id", function (d) {
                    return d.source.id + d.target.id
                });

        g.select("#g_foreground_ali").selectAll("title")
                .data(data.map(function (d) {
                    return d;
                }))
                .text(function (d) {
                    return "Cantidad: " + d.weight;
                })

        foreground.enter()
                .append("path")
                .style("stroke-width", function (d) {
                    return wScale(d.weight)
                })
                .attr("d", path)
                .attr("id", function (d) {
                    return d.source.id + d.target.id
                })
                .append("title")
                .text(function (d) {
                    return "Cantidad: " + d.weight;
                });

        foreground.on("click", function (d) {

            var obj = {source: d.source.id, target: d.target.id};
            var exists = $.grep(pathSelected, function (obj) {
                return obj.source == d.source.id && obj.target == d.target.id;
            });
            var i = pathSelected.indexOf(exists[0]);

            if (i != -1) {
                pathSelected.splice(i, 1);
                g.select('#g_foreground_ali').select('#' + d.source.id + d.target.id).attr('class', null);
                g.select('#g_foreground_ali').select('#' + d.source.id + d.target.id).style('display', 'none');
            } else {
                pathSelected.push(obj);
            }

            if (pathSelected.length != 0) {
                g.select('#g_foreground_ali').selectAll('path').style('display', 'none');
                for (var i = 0; i < pathSelected.length; i++) {
                    g.select('#g_foreground_ali').select('#' + pathSelected[i].source + pathSelected[i].target).attr('class', 'selected')
                }
                g.select('#g_foreground_ali').selectAll('.selected').style('display', null);

            } else {
                g.select('#g_foreground_ali').selectAll('path').style('display', null);
            }

            dispatch.filter(pathSelected);
        });

        foreground.exit().remove();

        glines.selectAll("circle")
                .data(nodes)
                .enter()
                .append("circle")
                .attr("r", 25)
                .style("fill", "lightgray")
                .style("stroke", "black")
                .style("stroke-width", "1px")
                .attr("cx", function (d) {
                    return d.x
                })
                .attr("cy", function (d) {
                    return d.y
                })
                .on("mouseover", nodeOver)
                .on("mouseout", nodeOut);

        function path(d, i) {
            var draw = d3.svg.line().interpolate("basis");
            return draw([[d.source.x, d.source.y], [d.target.x, d.target.y]])
        }

        function nodeOver(d, i) {
            d3.select(this).attr("fill", "gray");
            g.selectAll("path").style("opacity", function (p) {
                return p.source == d || p.target == d ? 1 : .5
            })
        }

        function nodeOut(d, i) {
            d3.select(this).attr("fill", "lightgray");
            g.selectAll("path").style("opacity", .5)
        }

    }

    chart.data = function (value) {
        if (!arguments.length)
            return data;
        data = value;
        return chart;
    }

    chart.width = function (value) {
        if (!arguments.length)
            return width;
        width = value;
        return chart;
    }

    chart.height = function (value) {
        if (!arguments.length)
            return height;
        height = value;
        return chart;
    }

    chart.labelVariable = function (value) {
        if (!arguments.length)
            return labelVariable;
        labelVariable = value;
        return chart;
    }

    chart.nodes = function (value) {
        if (!arguments.length)
            return nodes;
        nodes = value;
        return chart;
    }

    chart.labelsY = function (value) {
        if (!arguments.length)
            return labelsY;
        labelsY = value;
        return chart;
    }
    
    chart.dataSelected = function(value, type){
        if (!arguments.length)
            return dataSelected;
        dataSelected = value;
        typeSelected=type;
        return chart;  
    };
    
    function updateSelected() {
        var filtered = dataOrigin.filter(function (d) {
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
                return d;
            }
        });
        
        data=chart.countTrends(filtered,typeOrigin) ;
        update();
        
    };

    chart.updateSelected = updateSelected;
    
    chart.countTrends=function (dataMedidas, tipo){
        var data=[];
        var data1=[];
        for(var i=0;i<dataMedidas.length;i++){
            var dat1='v';
            var dat2='v';
            if(dataMedidas[i][tipo+'_sem40']){
                dat1=dataMedidas[i][tipo+'_sem40'];
            }
            if(dataMedidas[i][tipo+'_mes3']){
                dat2=dataMedidas[i][tipo+'_mes3'];
            }
            if(data1['sem40_'+dat1+'mes3_'+dat2]){
                data1['sem40_'+dat1+'mes3_'+dat2].weight++;
            }else{
                data1['sem40_'+dat1+'mes3_'+dat2]={source:'sem40_'+dat1, target:'mes3_'+dat2,weight:1};
                data.push(data1['sem40_'+dat1+'mes3_'+dat2]);
            }
            dat1=dat2;
            if(dataMedidas[i][tipo+'_mes6']){
                dat2=dataMedidas[i][tipo+'_mes6'];
            }
            if(data1['mes3_'+dat1+'mes6_'+dat2]){
                data1['mes3_'+dat1+'mes6_'+dat2].weight++;
            }else{
                data1['mes3_'+dat1+'mes6_'+dat2]={source:'mes3_'+dat1, target:'mes6_'+dat2,weight:1};
                data.push(data1['mes3_'+dat1+'mes6_'+dat2]);
            }
            dat1=dat2;
            if(dataMedidas[i][tipo+'_mes9']){
                dat2=dataMedidas[i][tipo+'_mes9'];
            }
            if(data1['mes6_'+dat1+'mes9_'+dat2]){
                data1['mes6_'+dat1+'mes9_'+dat2].weight++;
            }else{
                data1['mes6_'+dat1+'mes9_'+dat2]={source:'mes6_'+dat1, target:'mes9_'+dat2,weight:1};
                data.push(data1['mes6_'+dat1+'mes9_'+dat2]);
            }
            dat1=dat2;
            if(dataMedidas[i][tipo+'_mes12']){
                dat2=dataMedidas[i][tipo+'_mes12'];
            }
            if(data1['mes9_'+dat1+'mes12_'+dat2]){
                data1['mes9_'+dat1+'mes12_'+dat2].weight++;
            }else{
                data1['mes9_'+dat1+'mes12_'+dat2]={source:'mes9_'+dat1, target:'mes12_'+dat2,weight:1};
                data.push(data1['mes9_'+dat1+'mes12_'+dat2]);
            }
        }
        if(!dataOrigin){
            dataOrigin=dataMedidas;
            typeOrigin=tipo;
        }
        return data;
    }
    

    return d3.rebind(chart, dispatch, "on");
}