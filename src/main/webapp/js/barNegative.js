if(!d3.chart) d3.chart = {};
	
d3.chart.barNegative = function(){
    var g;
    var data;
    var width;
    var height;
    var min;
    var max;
    var nameVariable;
    var labelVariable;
    
    var dispatch = d3.dispatch(chart, "hover");

    function chart(container){
	
        g = container;
        g.append('text')
            .attr("x",0)
            .attr("y",0)
            .attr("dy",".5em")
            .attr('font-family', '"Helvetica Neue",Helvetica,Arial,sans-serif')
            .attr('font-size', '1.2em')
            .attr("id","label"+nameVariable)
            .text(labelVariable );
    
        g.append("image")
            .attr("x",0)
            .attr("y",10) 
            .attr("height","40px") 
            .attr("width","40px") 
            .attr("xlink:href","images/cargando.gif");  
    
        var margin = {top: 20, right: 30, bottom: 40, left: 30};
        
        g.append("g")
            .classed("bars",true)
            .attr("transform", "translate(0, 30)");
    
        g.append("g")
            .classed("x axis",true);
    
        update();
    }

    chart.update = update;

    function update(){
	       
        var y = d3.scale.linear()
            .range([height,0]);

        var x = d3.scale.ordinal()
            .rangeRoundBands([0, width], 0.1);

        var xAxis = d3.svg.axis()
            .scale(x)
            .orient("bottom")
            .tickSize(0)
            .tickPadding(6);

        //y.domain(d3.extent(data, function(d) { return d.value; })).nice();
        y.domain([parseInt(min),parseInt(max)]);
        x.domain(data.map(function(d) { return d.variable; }));

        var rect = g.select(".bars").selectAll(".bar")
            .data(data)
            .attr("class", function(d) { 
                return "bar bar--" + (parseInt(d.value) < 0 ? "negative" : "positive"); 
            })
            .attr("y", function(d) { 
                return parseInt(d.value) < 0 ? y(0) : y(d.value);
            })
            .attr("x", function(d) { return x(d.variable); })
            .attr("height", function(d) { 
                return Math.abs(y(d.value) - y(0)); })
            .attr("width", x.rangeBand());
    
         //var textBars = g.select("#"+nameVariable).selectAll("title")
         var textBars = g.select(".bars").selectAll("title")
                .data(data)  
                .text(function(d) {
                    return "Cantidad: " + Math.abs(parseInt(d.value));
                })            
                
        rect.enter().append("rect")
            .attr("class", function(d) { 
                return "bar bar--" + (parseInt(d.value) < 0 ? "negative" : "positive"); 
            })
            .attr("y", function(d) {  
                return parseInt(d.value) < 0 ? y(0) : y(d.value);
            })
            .attr("x", function(d) { return x(d.variable); })
            .attr("height", function(d) { 
		return Math.abs(y(d.value) - y(0)); })
            .attr("width", x.rangeBand())
            .append("title")
            .text(function(d) {
                return "Cantidad: " + Math.abs(parseInt(d.value));
            });

        rect.exit().remove();
        
        
        var xg = g.select(".x.axis")
                .attr("transform", "translate(0," + (y(0) + 30) + ")")
                .call(xAxis);
        
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

    chart.max = function(value) {
        if(!arguments.length) return max;
        max = value;
        return chart;
    }
    
    chart.min = function(value) {
        if(!arguments.length) return min;
        min = value;
        return chart;
    }
 
    chart.nameVariable = function(value) {
        if(!arguments.length) return nameVariable;
        nameVariable = value;
        return chart;
    }
    
    chart.labelVariable = function(value) {
        if(!arguments.length) return labelVariable;
        labelVariable = value;
        return chart;
    }
    
    
    return d3.rebind(chart, dispatch, "on");
}