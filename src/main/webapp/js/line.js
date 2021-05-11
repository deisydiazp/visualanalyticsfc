if(!d3.chart) d3.chart = {};

d3.chart.line = function() {
    var g;
    var data;
    var dispatch = d3.dispatch(chart, 'hover');
    var width;
    var height;
    var margin;
    var labelsX;
    var minY;
    var maxY;
    var orient;
  
    function chart(container) {
        g = container;

        margin = [ 30, 76, 70, 50 ];  //Top, right, bottom, left

        g.append("g")
            .classed("xaxis",true);
    
        g.append("g")
            .classed("yaxis",true);    
    
        update();
    }
    chart.update = update;

    function update(){
	
        var xScale; 

        if(orient == "left")
            xScale = d3.scale.ordinal().rangePoints([margin[3], width], .5);	
        if(orient == "right")
            xScale = d3.scale.ordinal().rangePoints([margin[3], width - 100], .5);	

        var yScale = d3.scale.linear().range([ margin[0], height - margin[2] ]);

        var xAxis = d3.svg.axis()
            .scale(xScale)
            .orient("bottom");

        var yAxis = d3.svg.axis()
            .scale(yScale)
            .orient(orient);

        var line = d3.svg.line()
            .x(function(d) {
                    return xScale(d.valueX);
            })
            .y(function(d) {
                    return yScale(+d.valueY);
            });


        var dataset = [];
        var dataMeasures = data.listaMedidas;
        for (var i = 0; i < dataMeasures.length; i++) {

            dataset[i] = {
                CODE: dataMeasures[i].CODE,
                measure: []
            };

            for (var j = 0; j < labelsX.length; j++) {
                if (dataMeasures[i][labelsX[j]]) {
                    dataset[i].measure.push({
                            valueX: labelsX[j],
                            valueY: dataMeasures[i][labelsX[j]]
                    });
                }
            }
        }
        
        var datasetStandard = [];
        var dataStandard = data.listaMedidasEstandar;
        for (var i = 0; i < dataStandard.length; i++) {

            datasetStandard[i] = {
                CODE: dataStandard[i].CODE,
                measure: []
            };

            for (var j = 0; j < labelsX.length; j++) {
                if (dataStandard[i][labelsX[j]]) {
                    datasetStandard[i].measure.push({
                            valueX: labelsX[j],
                            valueY: dataStandard[i][labelsX[j]]
                    });
                }
            }
        }
        
		
	xScale.domain(labelsX);
	yScale.domain([ maxY,minY]);

		
        var groups = g.selectAll(".line")
            .data(dataset)
            .attr("id", function(d){return d.CODE;})
    
        groups.enter()
            .append("g")
            .attr("class","line")
            .attr("id", function(d){return d.CODE;}); 
    
        groups.exit().remove();  
	
        var titles = groups.selectAll("title");
        titles.remove();
        
        groups.append("title")
            .text(function(d) {
                    return d.CODE;
            });

        groups.selectAll("path")
            .data(function(d) {
                    return [ d.measure ];
            })
            .enter()
            .append("path")
            .attr("d", line);
        
        groups.on("mouseover", function(d) {
            d3.select(this).select("path")
                .style("stroke", "black")
                .style("opacity", 1)
                dispatch.hover([d])
          })
        
        groups.on("mouseout", function(d) {
            d3.select(this).select("path")
                .style("stroke", "")
                .style("opacity", "")
                dispatch.hover([])
          })
        
        g.select(".xaxis")
            .attr("transform", "translate(0," + (height - margin[2]) + ")")
            .call(xAxis).selectAll("text")	
            .style("text-anchor", "end")
            .attr("dx", "-.8em")
            .attr("dy", ".15em")
            .attr("transform", function(d) {
                return "rotate(-65)" 
            });
		
        g.select(".yaxis")
            .attr("transform", 
                function(){ 
                    if(orient == 'left') 
                            return "translate(" + (margin[3]) + ",0)"
                    else
                            return "translate(" + (width - 100) + ",0)"
                })	
            .call(yAxis)
    
        
        /***************************************************************/
       
        var groups_0 = g.selectAll(".standard");
        groups_0.remove();
        
        groups_0 = g.selectAll(".standard")
            .data(datasetStandard)
            .enter()
            .append("g")
            .attr("class","standard")
            .attr("id", function(d){ return d.CODE;})
        
        groups_0.selectAll("title")
            .text(function(d) {
                    return d.CODE;
            });

        groups_0.selectAll("path")
            .data(function(d) {
                    return [ d.measure ];
            })
            .enter()
            .append("path")
            .attr("class", "lineStandard")
            .attr("d", line);
    
    }
	
    chart.data = function(value) {
        if(!arguments.length) return data;
        data = value;
        return chart;
    }
	
    chart.width = function(value) {
        if(!arguments.length) return width;
        width = value;
        return chart;
    }
	
    chart.height = function(value) {
        if(!arguments.length) return height;
        height = value;
        return chart;
    }
    
    chart.labelsX = function(value) {
        if(!arguments.length) return labelsX;
        labelsX = value;
        return chart;
    }
	
    chart.minY = function(value) {
        if(!arguments.length) return minY;
        minY = value;
        return chart;
    }
	
    chart.maxY = function(value) {
        if(!arguments.length) return maxY;
        maxY = value;
        return chart;
    }
	
    chart.orient = function(value) {
        if(!arguments.length) return orient;
        orient = value;
        return chart;
    }
    
    chart.highlight = function(d) {
  
        g.selectAll("path")
            .style("stroke", "")
            .style("opacity", "")

        var lines = g.select("g[id='" + d[0].CODE + "']").select("path")
            .style("stroke", "black")
            .style("opacity", 1) 
    
    
    }
	
    return d3.rebind(chart, dispatch, "on");
}