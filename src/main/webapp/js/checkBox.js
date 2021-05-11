    if(!d3.chart) d3.chart = {};

d3.chart.checkBox = function(){	

    var g;
    var size = 20;
    var x = 0;
    var y = 0;
    var markStrokeWidth = 3;
    var boxStrokeWidth = 3;
    var checked = false;
    var clickEvent;
    
    var dispatch = d3.dispatch(chart, "hover");

    function chart(container){
            g = container;

            checkBox();
    }
    chart.checkBox = checkBox;
	
    function checkBox () {
		
        var  box = g.append("rect")
            .attr("width", size)
            .attr("height", size)
            .attr("x", x)
            .attr("y", y)
            .style({
                "fill-opacity": 0,
                "stroke-width": boxStrokeWidth,
                "stroke": "black"
            });

        //Data to represent the check mark
        var coordinates = [
            {x: x + (size / 8), y: y + (size / 3)},
            {x: x + (size / 2.2), y: (y + size) - (size / 4)},
            {x: (x + size) - (size / 8), y: (y + (size / 10))}
        ];

        var line = d3.svg.line()
                .x(function(d){ return d.x; })
                .y(function(d){ return d.y; })
                .interpolate("basic");

        var mark = g.append("path")
            .attr("d", line(coordinates))
            .style({
                "stroke-width" : markStrokeWidth,
                "stroke" : "black",
                "fill" : "none",
                "opacity": (checked)? 1 : 0
            });

        g.on("click", function () {
            checked = !checked;
            mark.style("opacity", (checked)? 1 : 0);
            
            g.attr("checked",checked);
            
            if(clickEvent)
                clickEvent(checked);

            d3.event.stopPropagation();
            
        });
		
    }

    chart.size = function (value) {
        size = value;
        return chart;
    }

    chart.x = function (value) {
        x = value;
        return chart;
    }

    chart.y = function (value) {
        y = value;
        return chart;
    }

    chart.markStrokeWidth = function (value) {
        markStrokeWidth = value;
        return chart;
    }

    chart.boxStrokeWidth = function (value) {
        boxStrokeWidth = value;
        return chart;
    }

    chart.clickEvent = function(value) {
        if(!arguments.length) return clickEvent;
        clickEvent = value;
        return chart;
    }
    
    chart.checked = function(value) {
        if(!arguments.length) return checked;
        checked = value;
        return chart;
    }
    
    return d3.rebind(chart, dispatch, "on");

}