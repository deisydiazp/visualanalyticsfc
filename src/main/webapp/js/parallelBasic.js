if(!d3.chart) d3.chart = {};

d3.chart.parallelBasic = function() {
    var g;
    var data;
    var width;
    var height;
    var labelVariable;
    var nameVariable;
    var dimensionesX;
    var dimensions;
    var min;
    var max;
	
    var dispatch = d3.dispatch(chart, 'hover');

    function chart(container) {
        g = container;
        
        m = [20, 10, 20, 10];
        width = width - m[1] - m[3];
        height = height - m[0] - m[2];

        g.append("g")
            .attr("id","g_background_"+nameVariable);
    
        g.append("g")
            .attr("id","g_foreground_"+nameVariable);
			
		update();
    }
    chart.update = update;

    function update(){
	
        var x = d3.scale.ordinal().rangePoints([0, width], .5);
        var y = {};

        var line = d3.svg.line().defined(function(d) { return d[1] != null; });
        var axis = d3.svg.axis().orient("left");
        var background;
        var foreground;

        x.domain(dimensions = d3.keys(dimensionesX).filter(function(d) {
            return (y[d] = d3.scale.linear()
            .domain([min,max])
            .range([height, 0]));
        }));
		
	// Add grey background lines for context.
        g.select("#g_background_"+nameVariable)
            .attr("class","background")
            
    
        background = g.select("#g_background_"+nameVariable).selectAll("path")
            .data(data) 
            .attr("d", path)
            .attr("id",function(d) { return d.CODE; })
			.attr("genero",function(d) { return d.gender; });
        
        background.enter()
            .append("path")
            .attr("d", path)
            .attr("id",function(d) { return d.CODE; })
            .attr("genero",function(d) { return d.gender; });
		
	background.exit().remove();
		
        g.select("#g_foreground_"+nameVariable)
            .attr("class","foreground")
    
        foreground =  g.select("#g_foreground_"+nameVariable).selectAll("path")
            .data(data)
            .attr("d", path)
            .attr("id",function(d) { return d.CODE; })
			.attr("genero",function(d) { return d.gender; });
        
         g.select("#g_foreground_"+nameVariable).selectAll("title")
            .data(data)  
            .text(function(d) {
                return d.CODE;
            })
        
        foreground.enter()
            .append("path")
            .attr("d", path)
            .attr("id",function(d) { return d.CODE; })
			.attr("genero",function(d) { return d.gender; })
            .append("title")
                .text(function(d) {
                    return d.CODE;
                });
        
        foreground.exit().remove();	
				
	// Add a group element for each dimension.
        var gDimension = g.selectAll(".dimension")
            .data(dimensions)
            .attr("class", "dimension")
            .attr("transform", function(d) { return "translate(" + x(d) + ")"; });
        
        gDimension.enter().append("g")
            .attr("class", "dimension")
            .attr("transform", function(d) { return "translate(" + x(d) + ")"; });
        
        gDimension.exit().remove();
        
        
        axisDim = gDimension.selectAll(".axis")
        axisDim.remove();
        
        // Add an axis and title.
        gDimension.append("g")
            .attr("class", "axis")
            .each(function(d) { d3.select(this).call(axis.scale(y[d])); })
            .append("text")
            .attr("text-anchor", "middle")
            .attr("y", -9)
            .text(String);
        
        
        brushDim = gDimension.selectAll(".brush")
        brushDim.remove();
        // Add and store a brush for each axis.
        gDimension.append("g")
            .attr("class", "brush")
            .each(
                    function(d) { d3.select(this).call(y[d].brush = d3.svg.brush().y(y[d]).on("brush", brush));
            })
            .selectAll("rect")
            .attr("x", -8)
            .attr("width", 16);
	
            function path(d) {
                return line(dimensions.map(function(p) { 
                    if (d.lstProm[p] == 0) 
                            return [x(p), null];

                    return [x(p), y[p](d.lstProm[p])]; 
                }));
            }
            
            // Handles a brush event, toggling the display of foreground lines.
            function brush() {
                var actives = dimensions.filter(function(p) { return !y[p].brush.empty(); }),
                extents = actives.map(function(p) { return y[p].brush.extent(); });

                foreground.style("display", function(d) {
                    return actives.every(function(p, i) {
                        return extents[i][0] <= d.lstProm[p] && d.lstProm[p] <= extents[i][1];
                    }) ? null : "none";
                });
            }
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

    chart.labelVariable = function(value) {
        if(!arguments.length) return labelVariable;
        labelVariable = value;
        return chart;
    }

    chart.nameVariable = function(value) {
        if(!arguments.length) return nameVariable;
        nameVariable = value;
        return chart;
    }

	chart.dimensionesX = function(value) {
        if(!arguments.length) return dimensionesX;
        dimensionesX = value;
        return chart;
    }	
	
	chart.min = function(value) {
        if(!arguments.length) return min;
        min = value;
        return chart;
    }	
	
	chart.max = function(value) {
        if(!arguments.length) return max;
        max = value;
        return chart;
    }	
    
    return d3.rebind(chart, dispatch, "on");
}	