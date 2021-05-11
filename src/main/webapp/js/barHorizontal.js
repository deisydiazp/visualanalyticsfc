if(!d3.chart) d3.chart = {};

d3.chart.barHorizontal = function() {

    var data;
    var width;
    var height;
    var labelVariable;
    var sizeLabel = 20;  
    var nameVariable;
    var filtered;
    
    var dispatch = d3.dispatch(chart, 'hover');

    function chart(container) {
        g = container;
 
        g.append('text')
            .attr("x",0)
            .attr("y",0)
            .attr("dy",".5em")
            .attr('font-family', '"Helvetica Neue",Helvetica,Arial,sans-serif')
            .attr('font-size', '1.2em')
            .attr("id","label"+nameVariable)
            .text('\uf069' + ' ' + labelVariable );
 
        g.append("image")
            .attr("x",0)
            .attr("y",10) 
            .attr("height","40px") 
            .attr("width","40px") 
            .attr("xlink:href","images/cargando.gif");
    
        g.append("g")
            .attr("id","gCheck"+nameVariable);

        g.append("g")
            .attr("id","gBrush"+nameVariable);
      
      
        /******************************************************************/
        
        var widthButton = 45;
        var g_buttonsSerie = g.append("g")
            .attr("id","serie"+ nameVariable)
            .attr("transform", "translate(" + (width - ( data.length * widthButton)) + " ,0 )");

        var serie = d3.chart.button();
        serie.data(data);
        serie.orient("horizontal");
        serie.width(widthButton);
        serie.height(20);
        serie.labelVariable(labelVariable);
        serie.nameVariable(nameVariable);
        serie(g_buttonsSerie);
        
        /******************************************************************/    
      
      
        update();
    }
    chart.update = update;

    function update(){

        var check = d3.select("#gCheck"+nameVariable);
        check.select("text").remove(); 
        d3.select("#label"+nameVariable).attr("x",0);
           
        if(filtered){
            
            check.append('text')
                .attr("x",0)
                .attr("y",0)
                .attr("dy",".5em")
                .attr('font-family', 'FontAwesome')
                .attr('font-size', '1.2em')
                .text('\uf111')
                .attr('fill','#44F902')
        
            d3.select("#label"+nameVariable).attr("x",30);
        }
        
        var xMax = 0;
        $.each(data,function(i) {
            xMax += parseInt(data[i].value);
        });

        var xScale = d3.scale.linear()
            .range([0,width])
            .domain([0, xMax]);

        var bars = d3.select("#"+nameVariable).selectAll(".bar")
            .data(data);
        
        bars.enter()
            .append("g")
            .attr("class","bar");
        
        bars.exit().remove();
        
        var rect = bars.selectAll("rect")
        rect.remove();
        
        bars.append("rect")
            .attr("x", function(d,i){ 
                    var posX = 0;
                    for(var j = 0; j < i+1 ; j++){
                        posX = posX + parseInt(data[j].value);
                    }	
                    posX = posX - parseInt(d.value);
                    return xScale(posX);
            } )
            .attr("y", 50)
            .attr('width', function(d){ return xScale(parseInt(d.value)); })
            .attr('height',height)
            .attr('fill', function(d) { return d.color;})
            .append("title")
            .text(function(d) {
                    return labelVariable + ": " + d.label + " - Cantidad: " + d.value;
            });
            
        var text = bars.selectAll("text")
        text.remove();
        
        text = bars.append("text")
            .style("fill", "#FFFFFF") 
            .attr("x", function(d,i){ 
                var posX = 0;
                for(var j = 0; j < i+1 ; j++){
                    posX = posX + parseInt(data[j].value);
                }	
                posX = posX - parseInt(d.value);
                return xScale(posX);
            })
            .attr("y", 50)
            .attr("dy", "1.3em") 
            .attr("dx", ".8em")
            .text(function(d) { 
                if(xScale(parseInt(d.value)) < 50) 
                    return "";
                else
                    return d.value;
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

  