if(!d3.chart) d3.chart = {};
	
d3.chart.barGroup = function(){

    var g;
    var data;
    var width;
    var height;
    var sizeLabel = 30;
    var nameVariable;
    var filtered;
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
            .attr("class", "x axis")
            .attr("transform", "translate(30," + (height + 50) + ")");
                    
        g.append("g")
            .attr("class", "y axis")
            .attr("transform", "translate(30,50)")    
        
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
                  
                
        var x0 = d3.scale.ordinal()
                .rangeRoundBands([0, width], .1);

        var x1 = d3.scale.ordinal();

        var y = d3.scale.linear()
                .range([height, 0]);

        var gBrush = g.select("#gBrush"+nameVariable);       
        var brush= d3.svg.brush();
        brush.x(x0);
        brush(gBrush);
        gBrush.selectAll("rect").attr("height", 25).attr("y", height + 50).attr("x", 30);          

        var xAxis = d3.svg.axis()
                .scale(x0)
                .tickSize(0)
                .orient("bottom");

        var yAxis = d3.svg.axis()
                .scale(y)
                .orient("left");

       

        var dataAux = [];
        var categoriesNames = [];
        var formatNumber = d3.format(",.2f");
        for(var i = 0; i< data.length; i++){
            var groupVariable = data[i].nameVariable;
            for(var j = 0; j< data[i].categories.length; j++){
                var category = {    
                                    'nameVariable':groupVariable,                                
                                    'value': formatNumber(data[i].categories[j].value), 
                                    'color': data[i].categories[j].color
                                };
                var index = categoriesNames.indexOf(data[i].categories[j].label);
                if(index < 0){    

                    var obj = { 'variable' : data[i].categories[j].label,
                        categories:[]
                    }
                    obj.categories.push(category);
                    dataAux.push(obj)
                    categoriesNames.push(data[i].categories[j].label);
                }
                else{
                    dataAux[index].categories.push(category);
                }
            }
        }
        
	var rateNames = dataAux[0].categories.map(function(d) { return d.nameVariable; });
                
        x0.domain(categoriesNames);
        x1.domain(rateNames).rangeRoundBands([0, x0.rangeBand()]);
        
        y.domain([0, d3.max(data, function(d) { return d3.max(d.categories, function(e) { return parseInt(e.value) + 10; }); })]);
        
        g.select(".x.axis")
                .call(xAxis);

        g.select(".y.axis")
                .call(yAxis)
                .append("text")
                .attr("transform", "rotate(-90)")
                .attr("y", 6)
                .attr("dy", ".71em")
                .style("text-anchor", "end")
                .style('font-weight','bold')
                .text("%");

        var slice = g.selectAll(".g")
                .data(dataAux)
                .attr("transform",function(d) { return "translate(" + (x0(d.variable) + 30) + ",50)"; });
        
        slice.enter().append("g")
                .attr("class", "g")
                .attr("transform",function(d) { return "translate(" + (x0(d.variable) + 30) + ",50)"; });
        
        slice.exit().remove();
        
        var rect = slice.selectAll("rect")
            .data(function(d) { return d.categories; })
            .attr("width", x1.rangeBand())
            .attr("x", function(d) { return x1(d.nameVariable); })
            .style("fill", function(d) { return d.color })
            .attr("y", function(d) { return y(d.value); })
            .attr("height", function(d) { return height - y(d.value); })
            .on("mouseover", function(d) {
                    d3.select(this).style("fill", "#bd9e39");
            })
            .on("mouseout", function(d) {
                    d3.select(this).style("fill", d.color);
            });
            
        var title = rect.select("title")
            .data(function(d) { return d.categories; })
            .text(function(d) {
                      return d.value + "%"});
        
        rect.enter().append("rect")
            .attr("width", x1.rangeBand())
            .attr("x", function(d) { return x1(d.nameVariable); })
            .style("fill", function(d) { return d.color })
            .attr("y", function(d) { return y(d.value); })
            .attr("height", function(d) { return height - y(d.value); })
            .on("mouseover", function(d) {
                d3.select(this).style("fill", "#bd9e39");
            })
            .on("mouseout", function(d) {
                d3.select(this).style("fill", d.color);
            })
            .append("title")
                .text(function(d) {
                      return d.value + "%";
            }); 
    
        rect.exit().remove();    
    
        brush.on("brushend", function() {
            
            var ext = brush.extent();
            
            var labels = g.select(".x.axis").selectAll(".tick").select("text");
            
            var valuesFilters = [];
            var valuesLabels = [];
            for(var i = 0; i<labels[0].length; i++){
                var label = labels[0][i].innerHTML;
                var posX = x0(label)+(x0.rangeBand()/2);
                if(posX >= (ext[0]-(x0.rangeBand()/2)) && posX <= (ext[1]+(x0.rangeBand()/2))){
                    valuesFilters.push(label);
                    valuesLabels.push(label);
                }
            }
            var varMatch = {

                labelVariable:labelVariable,
                nameVariable:nameVariable,
                valuesFilters:valuesFilters,
                valuesLabels:valuesLabels,
                typeFilter:"or"
            }
            
            updateVariablesMatch(varMatch, true);

        });    
                  
          
        //Legend
        
        var legend = g.selectAll(".legend")
            .data(dataAux[0].categories.map(function(d) { return d; }).reverse())
            .attr("transform", function(d,i) { return "translate(0," + i * 20 + ")"; });

        legend.enter().append("g")
            .attr("class", "legend")
            .attr("transform", function(d,i) { return "translate(0," + i * 20 + ")"; });

        legend.select("rect").remove();
        legend.select("text").remove();
        
        legend.append("rect")
            .attr("x", width - 18)
            .attr("width", 18)
            .attr("height", 18)
            .style("fill", function(d) { return d.color; });

        legend.append("text")
            .attr("x", width - 24)
            .attr("y", 9)
            .attr("dy", ".35em")
            .style("text-anchor", "end")
            .text(function(d) {return d.nameVariable; });
	
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