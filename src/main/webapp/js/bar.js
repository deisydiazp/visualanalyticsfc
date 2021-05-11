if(!d3.chart) d3.chart = {};
	
d3.chart.bar = function(){

    var g;
    var data;
    var width;
    var height;
    var sizeLabel = 30;
    var nameVariable;
    var filtered;
    var labelVariable;
    var withBrush = true;
    
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
            .classed("xaxis",true);

        g.append("g")
            .attr("id","gBars"+nameVariable);
        
        if(withBrush) 
            g.append("g").attr("id","gBrush"+nameVariable);
    
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
        
        var dataDraw = [];
        for(var i = 0; i<data.length; i++){
            if(data[i].value != "0") 
                dataDraw.push(data[i]);
        }
        
        var xScale;
        xScale = d3.scale.ordinal()
                .rangeRoundBands([0, width], .1)
                .domain(dataDraw.map(function(d) { return d.label; }));
        
        var gBrush = g.select("#gBrush"+nameVariable)
        
        var brush;
        if(withBrush)  {          
            brush= d3.svg.brush()
            brush.x(xScale);
            brush(gBrush);
            gBrush.selectAll("rect").attr("height", 25).attr("y", height + sizeLabel);        
        }    

        var yScale = d3.scale.linear()
                .range([height, 0])
                .domain([0, d3.max(dataDraw, function(d) { return parseInt(d.value); })]);	

        var xAxis = d3.svg.axis()
                .scale(xScale)
                .orient("bottom");

        var xg = g.select(".xaxis")
                .classed("axis",true)
                .attr("transform","translate(" + [0, (height + sizeLabel)] + ")")
                .call(xAxis)
                .selectAll(".tick text")
                .call(wrap, xScale.rangeBand());
        
        var bars = g.select("#gBars"+nameVariable).selectAll(".bar")
                .data(dataDraw)
                .attr("x", function(d) { return xScale(d.label); })
                .attr("width", xScale.rangeBand())
                .attr("y", function(d) { return yScale(parseInt(d.value)) + sizeLabel; })
                .attr("height", function(d) { return height - yScale(parseInt(d.value)); })
                .attr("fill", function(d) { 
                    if(d.variable == "")
                        return "#bd9e39";
                    else
                        return "#9467bd"})  

        var textBars = g.select("#gBars"+nameVariable).selectAll("title")
                .data(dataDraw)  
                .text(function(d) {
                        return "Cantidad: " + d.value;
                })        

        bars.enter()
                .append("rect")	
                .attr("class", "bar")
                .attr("x", function(d) { 
                    return xScale(d.label); 
                })
                .attr("width", xScale.rangeBand())
                .attr("y", function(d) { return yScale(parseInt(d.value)) + sizeLabel; })
                .attr("height", function(d) { return height - yScale(parseInt(d.value)); })
                .attr("fill", function(d) { 
                    if(d.variable == "")
                        return "#bd9e39";
                    else
                        return "#9467bd"})    
                .append("title")
                .text(function(d) {
                        return "Cantidad: " + d.value;
                });

        bars.exit().remove();
        
        if(withBrush){
            brush.on("brushend", function() {

                var ext = brush.extent();
                var tam=width/(dataDraw.length);

                var filtered = dataDraw.filter(function(d) {
                    return (dataDraw.indexOf(d)*tam + tam*0.5 >= ext[0] && dataDraw.indexOf(d)*tam + tam*0.5<= ext[1])||
                        ((dataDraw.indexOf(d)+1)*tam - tam*0.5 >= ext[0] && (dataDraw.indexOf(d)+1)*tam - tam*0.5<= ext[1])
                })

                var valuesFilters = [];
                var valuesLabels = [];
                for(var i = 0; i < filtered.length; i++){
                    valuesFilters.push(filtered[i].variable);
                    valuesLabels.push(filtered[i].label)
                }
                
                var varMatch = {

                    labelVariable:labelVariable,
                    nameVariable:nameVariable,
                    valuesFilters:valuesFilters,
                    valuesLabels:valuesLabels,
                    typeFilter:"or"
                }
                updateVariablesMatch(varMatch, true);

            })
         }    
    }

    function wrap(text, width) {
        text.each(function() {
        var text = d3.select(this),
            words = text.text().split(/\s+/).reverse(),
            word,
            line = [],
            lineNumber = 0,
            lineHeight = 1.1, // ems
            y = text.attr("y"),
            dy = parseFloat(text.attr("dy")),
            tspan = text.text(null).append("tspan").attr("x", 0).attr("y", y).attr("dy", dy + "em");
            while (word = words.pop()) {
                line.push(word);
                tspan.text(line.join(" "));
                if (tspan.node().getComputedTextLength() > width) {
                    line.pop();
                    tspan.text(line.join(" "));
                    line = [word];
                    tspan = text.append("tspan").attr("x", 0).attr("y", y).attr("dy", ++lineNumber * lineHeight + dy + "em").text(word);
                }
            }
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
    
    chart.withBrush = function(value) {
        if(!arguments.length) return withBrush;
        withBrush = value;
        return chart;
    }
    
    return d3.rebind(chart, dispatch, "on");
}