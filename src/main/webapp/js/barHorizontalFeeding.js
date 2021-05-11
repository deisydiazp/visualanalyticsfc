if(!d3.chart) d3.chart = {};

d3.chart.barHorizontalFeeding = function() {

    var data;
    var width;
    var height;
    var labelVariable;
    var nameVariable;
    var filtered;
    var padding = 20;
    var marginLeft = 35;
    var valueCheck;
	
    var dispatch = d3.dispatch(chart, 'hover');

    function chart(container) {
        g = container;
        update();
    }
    chart.update = update;

    function update(){
        
        var widthEdad = (width - marginLeft - (padding * (data[0].edades.length - 1)))/data[0].edades.length;
        var moveY = 20;
        var cont = 0;

        g.selectAll("g")
            .data(data[0].edades)
            .enter()
            .append("g")
            .attr("id",function(d){ return "alim_" + d.edad })
            .append("text")
            .text(function(d){ return d.edad })
            .attr("x",function(d,i){ return ((widthEdad + padding) * i) + marginLeft })


        data.forEach( function(year){

            var moveX = marginLeft;
            cont = 0;
   
            g.append("text")
                .text(year.year)
                .attr("x", 0)
                .attr("y", moveY)
                .attr("dy", "1.3em");

            year.edades.forEach( function(edad) {

                grupoEdad = g.select("#alim_"+edad.edad);	
                grupoYear = grupoEdad.append("g")
                        .attr("id",year.year)
                        .attr("transform", "translate(" + moveX + "," + moveY+ ")");

                var xMax = 0;
                edad.feeding.forEach(function (categAlimentacion){
                    xMax += parseInt(categAlimentacion.value);
                })

                var xScale = d3.scale.linear()
                        .range([0,widthEdad])
                        .domain([0, xMax]);	

                var bars = grupoYear.selectAll(".bar")
                        .data(edad.feeding);

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
                                        posX = posX + parseInt(edad.feeding[j].value);
                                }	
                                posX = posX - parseInt(d.value);
                                return xScale(posX);
                } )
                .attr("y", 0)
                .attr('width', function(d){ return xScale(parseInt(d.value)); })
                .attr('height',height)
                .attr('fill', function(d) { return d.color;})
                .append("title")
                .text(function(d) {
                                return "Cantidad: " + d.value;
                });
                cont++;
                moveX = ((widthEdad + padding)*cont) + marginLeft;

        })


        moveY = moveY+30;	
        })
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

  