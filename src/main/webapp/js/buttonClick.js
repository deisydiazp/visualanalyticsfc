if(!d3.chart) d3.chart = {};

d3.chart.buttonClick = function() {

    var data;
    var dispatch = d3.dispatch(chart, 'hover');
    var width;
    var height;
    var orient;
    var nameVariable;
    var labelVariable;
    //var Inclusive;

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

        update();
    }
    chart.update = update;

    function update(){
       
        var buttons = d3.select("#"+nameVariable).selectAll("g");
        buttons.remove();
        // Add buttons
        buttons = d3.select("#"+nameVariable).selectAll("g")
                .data(data)
                .enter()
                .append("g")
                .attr('selected',function(d){return d.selected; });

        rects = buttons.append("rect")
                .attr("x", function(d,i){	
                        if(orient == "vertical")
                                return 0;
                        if(orient == "horizontal")
                                return (i * width); 
                })
                .attr("y", function(d,i){	
                        if(orient == "vertical")
                                return ((i * height) + 25);
                        if(orient == "horizontal")
                                return 25; 
                })
                .attr('width', width + "px")
                .attr('height', height +"px")
                .attr('fill', function(d){
     
                    if(d.selected == true)
                        return d.color; 
                    else
                        return "#ccc"
                });
                
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
                                return ((i * height) + 25);
                        if(orient == "horizontal")
                                return 25; 
                })  
                .attr("dy", "1.3em") 
                .attr("dx", ".8em") 
                .text(function(d) { return d.label;});

        buttons.on("click", function(d) {
           
            var selected = !d.selected;
            var valuesFilter =  data.map(function(d){ return d.value; });  
           
            for(var i = 0; i < data.length; i++){
                data[i].selected = true;
            }
            
            if(selected == false){
                
                var i = valuesFilter.indexOf(d.value);
                if(i != -1) {
                    valuesFilter.splice(i, 1);
                }
                
                d.selected = false
            }
            
            var labels = data.map(function(d){ if(d.selected) return d.label; });  
            
            var varMatch = {
                labelVariable:labelVariable,
                nameVariable:nameVariable,
                valuesFilters:valuesFilter,
                valuesLabels:labels,
                typeFilter:"or"
            }
            update();
            updateVariablesMatch(varMatch,true);
                
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

  