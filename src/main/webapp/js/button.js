if(!d3.chart) d3.chart = {};

d3.chart.button = function() {

    var data;
    var dispatch = d3.dispatch(chart, 'hover');
    var width;
    var height;
    var orient;
    var nameVariable;
    var labelVariable;

    function chart(container) {
            g = container;

            g.append("g")
            .attr("id","gButtons"+nameVariable);

            g.append("g")
            .attr("id","gBrush"+nameVariable);
    
            update();
    }
    chart.update = update;

    function update(){

        var scale;
        var brush = d3.svg.brush();
        if(orient == "vertical"){
                scale = d3.scale.ordinal()
                        .domain(data, function(d){ return d.variable;})
                        .rangePoints([data.length * height, 0]);  

                gBrush = g.select("#gBrush")

                brush.y(scale);
                brush(gBrush);
                gBrush.selectAll("rect").attr("width", width).attr("x", 0);
        }

        if(orient == "horizontal"){
                scale = d3.scale.ordinal()
                        .domain(data, function(d){ return d.variable;})
                        .rangePoints([0,data.length * width]);  

                gBrush = g.select("#gBrush"+nameVariable)

                brush.x(scale);
                brush(gBrush);
                gBrush.selectAll("rect").attr("height", height).attr("y", 0);
        }

        // Add buttons
        var buttons = g.select("#gButtons"+nameVariable).selectAll("g")
                .data(data)
                .enter()
                .append("g");

        rects = buttons.append("rect")
                .attr("x", function(d,i){	
                        if(orient == "vertical")
                                return 0;
                        if(orient == "horizontal")
                                return (i * width); 
                })
                .attr("y", function(d,i){	
                        if(orient == "vertical")
                                return (i * height);
                        if(orient == "horizontal")
                                return 0; 
                })
                .attr('width', width + "px")
                .attr('height', height +"px")
                .attr('stroke','#FFF')
                .attr('fill', function(d){ return d.color; });

        text =  buttons.append("text")
                .style("fill", "#FFF") 
                .attr("x", function(d,i){	
                        if(orient == "vertical")
                                return 0;
                        if(orient == "horizontal")
                                return (i * width); 
                })
                .attr("y", function(d,i){	
                        if(orient == "vertical")
                                return (i * height);
                        if(orient == "horizontal")
                                return 0; 
                })  
                .attr("dy", "1.2em") 
                .attr("dx", ".5em") 
                .text(function(d) { return d.labelCorto;});

        brush.on("brushend", function() {
            
                var ext = brush.extent()
                
                if(ext[0] != ext[1]){
                    
                    var tam;
                    if(orient == "vertical")
                            tam = height;
                    if(orient == "horizontal")
                            tam = width;

                    var filtered = data.filter(function(d) {
                        return  (data.indexOf(d)*tam <= ext[0] && (data.indexOf(d)+1)*tam >= ext[0])||(data.indexOf(d)*tam <= ext[1] && (data.indexOf(d)+1)*tam >= ext[1])||(data.indexOf(d)*tam >= ext[0] && data.indexOf(d)*tam <= ext[1])||((data.indexOf(d)+1)*tam >= ext[0] && (data.indexOf(d)+1)*tam <= ext[1]);
               
                    })

                    var valuesFilters = [];
                    var valuesLabels = [];
                    for(var i = 0; i < filtered.length; i++){
                        valuesFilters.push(filtered[i].variable);
                        valuesLabels.push(filtered[i].label);
                    }

                    var varMatch = {
                        labelVariable:labelVariable,
                        nameVariable:nameVariable,
                        valuesFilters:valuesFilters,
                        valuesLabels:valuesLabels,
                        typeFilter:"or"
                    }
                    updateVariablesMatch(varMatch,true);
                }
                
                /*if(ext[0] == ext[1]){
                    var varMatch = {
                        variable:nameVariable
                    }
                    updateVariablesMatch(varMatch,false);
                }*/
        });

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

    chart.orient = function(value) {
            if(!arguments.length) return orient;
            orient = value;
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

  