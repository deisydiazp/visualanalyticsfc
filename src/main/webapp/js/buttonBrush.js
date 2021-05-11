if(!d3.chart) d3.chart = {};

d3.chart.buttonBrush = function() {

    var data;
    var dispatch = d3.dispatch(chart, 'hover');
    var width;
    var height;
    var filtered = false;
    var nameVariable;
    var labelVariable;
    var widthRect;
    var heightRect;

    function chart(container) {
        g = container;
        g.append('text')
            .attr("x",0)
            .attr("y",5)
            .attr("dy",".5em")
            .attr('font-family', '"Helvetica Neue",Helvetica,Arial,sans-serif')
            .attr('font-size', '1.2em')
            .attr("id","label"+nameVariable)
            .text('\uf069' + ' ' + labelVariable );


        g.append("g")
            .attr("id","gCheck"+nameVariable);

        g.append("g")
           .attr("id","gButtons"+nameVariable);

        g.append("g")
          .attr("id","gBrush"+nameVariable);


        widthRect = width/data.length;
        heightRect = height;


        update();
    }
    chart.update = update;
    chart.marckFiltered = marckFiltered;

    function marckFiltered(){
        var check = d3.select("#gCheck"+nameVariable);
        check.select("text").remove(); 
        d3.select("#label"+nameVariable).attr("x",0);
           
        if(filtered){
            
            check.append('text')
                .attr("x",0)
                .attr("y",5)
                .attr("dy",".5em")
                .attr('font-family', 'FontAwesome')
                .attr('font-size', '1.2em')
                .text('\uf111')
                .attr('fill','#44F902')
        
            d3.select("#label"+nameVariable).attr("x",30);
        }
    }

    function update(){

        var scale;
        var brush = d3.svg.brush();
        
        scale = d3.scale.ordinal()
                .domain(data, function(d){ return d.variable;})
                .rangePoints([0, width]);  

        gBrush = g.select("#gBrush"+nameVariable)

        brush.x(scale);
        brush(gBrush);
        gBrush.selectAll("rect").attr("height", heightRect).attr("y", 25);
        

        // Add buttons
        var buttons = g.select("#gButtons"+nameVariable).selectAll("g")
                .data(data)
                .enter()
                .append("g");

        rects = buttons.append("rect")
                .attr("x", function(d,i){	
                     return (i * widthRect); 
                })
                .attr("y", 25)
                .attr('width', widthRect + "px")
                .attr('height', heightRect +"px")
                .attr('stroke','#FFF')
                .attr('fill', function(d){ return d.color; });

        text =  buttons.append("text")
                .style("fill", "#FFF") 
                .attr("x", function(d,i){	
                     return (i * widthRect); 
                })
                .attr("y", 25)  
                .attr("dy", "1.2em") 
                .attr("dx", ".5em") 
                .text(function(d) { return d.labelCorto;});

        brush.on("brushend", function() {
            
                var ext = brush.extent()
                
                if(ext[0] != ext[1]){
                    
                    var tam = widthRect;

                    /*var filtered = data.filter(function(d) {
                        return  (data.indexOf(d)*tam + 50 <= ext[0] && (data.indexOf(d)+1)*tam + 50 >= ext[0])||
                                (data.indexOf(d)*tam + 50 <= ext[1] && (data.indexOf(d)+1)*tam + 50 >= ext[1])||
                                (data.indexOf(d)*tam + 50>= ext[0] && data.indexOf(d)*tam + 50 <= ext[1])||
                                ((data.indexOf(d)+1)*tam + 50 >= ext[0] && (data.indexOf(d)+1)*tam <= ext[1]);
               
                    })*/
                
                    var filtered = data.filter(function(d) {
                        return  (data.indexOf(d)*tam <= ext[0] && (data.indexOf(d)+1)*tam >= ext[0])||
                                (data.indexOf(d)*tam <= ext[1] && (data.indexOf(d)+1)*tam >= ext[1])||
                                (data.indexOf(d)*tam >= ext[0] && data.indexOf(d)*tam <= ext[1])||
                                ((data.indexOf(d)+1)*tam >= ext[0] && (data.indexOf(d)+1)*tam <= ext[1]);
               
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

    chart.filtered = function(value) {
        if(!arguments.length) return filtered;
        filtered = value;
        return chart;
    }
    
    return d3.rebind(chart, dispatch, "on");
}

  