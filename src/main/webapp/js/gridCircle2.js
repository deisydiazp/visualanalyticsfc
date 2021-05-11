if (!d3.chart)

d3.chart = {};

d3.chart.gridCircle2 = function () {
	var g;
        var data;
        var width; // = 500;
	var height; // = 400;
        var sizeLabel = 30;
        var nameVariable;
        var labelVariable;
        var filtered=false;
        
	var dispatch = d3.dispatch(chart, "filter");
	
	function chart(container) {
		
            g = container;		
            g.append('text')
                .attr("x",0)
                .attr("y",0)
                .attr("dy",".5em")
                .attr('font-family', '"Helvetica Neue",Helvetica,Arial,sans-serif')
                .attr('font-size', '1.2em')
                .attr("id","label"+nameVariable)
                .text(labelVariable );
 
            
            g.append("g")
                .classed("x axis",true);
    
            g.append("g")
                .classed("y axis",true);
			
            update();		
	}
	
	chart.update = update;
	
	function update() {
		
		var x = d3.scale.ordinal()
                    //.domain(data.map(function(d){ return d.label;}))
                    .domain(['PT','AT'])
                    .rangePoints([0,width],1.5);
			
		var xAxis = d3.svg.axis()
                    .scale(x)
                    .orient('bottom')
                    .tickPadding(6)
                    .tickSize(-height);
	
		var xg = g.select(".x.axis")
                    .attr('transform', 'translate(20,'+ (height + sizeLabel) +')')
                    .call(xAxis);

		var y = d3.scale.ordinal()
                    //.domain(data.map(function(d){ return d.labelCorto;}))
                    .domain(['PEG','AEG'])
                    .rangePoints([height,0],1.5);
	
		
		var yAxis = d3.svg.axis()
                    .scale(y)
                    .orient('left')
                    .tickPadding(6)
                    .tickSize(-width);
	
		var yg = g.select(".y.axis")
			.attr('transform', 'translate(20,' + sizeLabel + ')')
			.call(yAxis);

                var max = d3.max(data,function(d){return parseInt(d.value);});
          
		var circle = g.selectAll("circle")
                    .data(data.map(function(d) { return d; }))
                    .style("fill",function(d){ return d.color})
                    .attr("cy", function(d){ return y(d.labelCorto) + sizeLabel})
                    .attr("cx", function(d){ return x(d.label) + 20})
                    .attr("r", function(d) {  
                        return Math.sqrt(d.value/max)*height/4; 
                    })
                   
                var textCircle = g.selectAll("title")
                    .data(data.map(function(d) { return d; }))  
                    .text(function(d) {
                        //console.log(d.value);
                        return "Cantidad: " + d.value;
                })        
        

		circle.enter().append("circle")
                    .style("fill",function(d){ return d.color})
                    .style("opacity", .3)
                    .attr("cy", function(d){ return y(d.labelCorto) + sizeLabel})
                    .attr("cx", function(d){ return x(d.label) + 20})
                    .attr("r", function(d) { 
                        return Math.sqrt(d.value/max)*height/4; 
                    })
                    .append("title")
                    .text(function(d) { return "Cantidad: " + d.value; });

		circle.exit().remove();
	}
	
	chart.data = function(value) {
            if (!arguments.length) return data;
            data = value;
            return chart;
	};
	
        chart.width = function(value) {
            if (!arguments.length) return width;
            width = value;
            return chart;
	};
        
        chart.height = function(value) {
            if (!arguments.length) return height;
            height = value;
            return chart;
	};

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

        chart.filtered = function(value) {
            if(!arguments.length) return filtered;
            filtered = value;
            return chart;
        }
     
        return d3.rebind(chart, dispatch, "on");
}