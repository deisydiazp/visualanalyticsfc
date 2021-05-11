if(!d3.chart) d3.chart = {};

d3.chart.stackedBarNegative = function() {

	var data;
	var width;
	var height;
	var negative = false;
        var nameVariable;
	var dispatch = d3.dispatch(chart, 'hover');
        var margin = {top: 50, right: 50, bottom: 20, left: 20};
	
	function chart(container) {
            
            width = width - margin.left;// - margin.right,
            height = 700 - margin.top - margin.bottom;
            
            g = container;
            
            g.append("image")
            .attr("x",-50)
            .attr("y",10) 
            .attr("height","40px") 
            .attr("width","40px") 
            .attr("xlink:href","images/cargando.gif");
            
            g.append("g").attr("id","xaxis_stacked");

            g.append("g").attr("id","yaxis_stacked");
            
            g.append("rect").attr("id","background_1"+ nameVariable);

            g.append("rect").attr("id","background_2"+ nameVariable);
            
            g.append("g").attr("id","axisZero" + nameVariable);

            update();
    }
	chart.update = update;
	
	function update(){
		
                var removeRect = g.selectAll(".rectGender");
                removeRect.remove();
                
		var yScale = d3.scale.ordinal()
			.rangeRoundBands([0, height], .3);

		var xScale = d3.scale.linear()
			.rangeRound([0, width]);

		var xAxis = d3.svg.axis()
			.scale(xScale)
			.tickFormat(d3.format(",%"))
                        .tickSize(1)
			.orient("bottom");
            
		var yAxis = d3.svg.axis()
			.scale(yScale)
			.tickSize(0)
			.orient("left");
  
		var arrX = [];
		
		if(data.length == 2)
                    negative = true;	
		
	
		var objectsAge = new Array();
		
		data.forEach(function(row) {
			
			row.age.forEach(function (age){
			
				var xTotal = 0;	
				age.value.forEach(function (rciu){
					
					var x0 = 0;
					var x1 = 0;
					
					xTotal += rciu.valueAbsolute;
					if(negative){	
						x0 = xTotal * (-1);
						x1 = x0 + rciu.valueAbsolute;
					}
					else{
						x1 = xTotal;
						x0 = x1 - rciu.valueAbsolute
					}
					
					FoundAt = KeyValueindex(objectsAge, "age", age.variable);
				
					if (FoundAt > -1) {
						temp = objectsAge[KeyValueindex(objectsAge, "age", age.variable)];
						temp.children.push({
                                                                        "variable":rciu.variable,
                                                                        "valueAbsolute": rciu.valueAbsolute, 
                                                                        "x0": x0,
                                                                        "x1": x1,
                                                                        "color": rciu.color
                                                                });
					}
					//if not found new object is created and pushed into array
					else {
						temp = new Object();
						temp.age = age.variable;
						temp.children = new Array();
						temp.children.push({
                                                                        "variable":rciu.variable,
                                                                        "valueAbsolute": rciu.valueAbsolute, 
                                                                        "x0": x0,
                                                                        "x1": x1,
                                                                        "color": rciu.color
                                                                });
						objectsAge.push(temp);
					}
					
				});

			});
			negative = false;
		});
		
		//objectsAge.sort(function (d){return d.age;});
		
                objectsAge.forEach(function (age){
			
			var totalAge = 0;
			age.children.forEach(function(child){
				totalAge += child.valueAbsolute
			});
			
			age.children.forEach(function(child){
				child.valueRelative = child.valueAbsolute/totalAge;
				
				child.x0 = child.x0/totalAge;
				child.x1 = child.x1/totalAge;
				
				arrX.push(child.x0);
				arrX.push(child.x1);
					
			});
		})
		
		/*objectsAge.sort(function(a,b) {
                    return b.age < a.age;
                });*/
                  
		var min = d3.min(arrX);
		var max = d3.max(arrX);

		
                xScale.domain([min, max]).nice();	
		yScale.domain(objectsAge.map(function(d){ 
			return d.age; 
		}));
               

               
                
		d3.selectAll("#xaxis_stacked")
                    .attr("transform", "translate(0, " + (height + margin.top) + ")")
                    .call(xAxis);	

               
		d3.selectAll("#yaxis_stacked")
                    .attr("transform", "translate(0, " + margin.top + ")")
                    .call(yAxis);
		
                d3.select("#background_1" + nameVariable)
                        .attr("x",0)
                        .attr("y",0)
                        .attr("width",xScale(0) + "px")
                        .attr("height", (height + margin.top) + "px")
                        .attr("fill", "#F2E0F7");
                
                d3.select("#background_2" + nameVariable)
                        .attr("x",xScale(0))
                        .attr("y",0)
                        .attr("width", (width - xScale(0)) + "px")
                        .attr("height", (height + margin.top) + "px")
                        .attr("fill", "#CEE3F6");
            
		var rows = d3.select("#"+nameVariable).selectAll(".bar")
			.data(objectsAge.map( function(d){
					return d;
				}))
			.attr("transform", function(d) { 
				return "translate(0," + (yScale(d.age) + margin.top) + ")"; 
			})
			.on("mouseover", function(d) {
				g.selectAll('.y').selectAll('text').filter(function(text) { return text===d.age; })
				.transition().duration(100).style('font','15px sans-serif');
			})
			.on("mouseout", function(d) {
				g.selectAll('.y').selectAll('text').filter(function(text) { return text===d.age; })
				.transition().duration(100).style('font','10px sans-serif');
		  });	
		
		rows.enter()
			.append("g")
			.attr("class", "bar")
			.attr("transform", function(d) { 
				return "translate(0," + (yScale(d.age) + margin.top) + ")"; 
			})
			.on("mouseover", function(d) {
				g.selectAll('.y').selectAll('text').filter(function(text) { return text===d.age; })
				.transition().duration(100).style('font','15px sans-serif');
			})
			.on("mouseout", function(d) {
				g.selectAll('.y').selectAll('text').filter(function(text) { return text===d.age; })
				.transition().duration(100).style('font','10px sans-serif');
			});
		
		rows.exit().remove();	
		
		var groupBars = rows.selectAll("g")
			.data(function(d) { 
				return d.children; 
			});
		groupBars.enter()
			.append("g");
		
		groupBars.exit().remove();
		
		rects = groupBars.selectAll("rect")
		rects.remove();

		groupBars.append("rect")
			.attr("height", yScale.rangeBand())
			.attr("x", function(d) { return xScale(d.x0); })
			.attr("width", function(d) { return xScale(d.x1) - xScale(d.x0); })
			.style("fill", function(d) { return d.color; })
                        .append("title")
                        .text(function(d) { return d.valueAbsolute });
		
		texts = groupBars.selectAll("text")
		texts.remove();
		
		groupBars.append("text")
			.attr("x", function(d) { return xScale(d.x0); })
			.attr("y", yScale.rangeBand()/2)
			.attr("dy", "0.5em")
			.attr("dx", "0.5em")
			.style("text-anchor", "begin")
                        .style("fill", "#FFFFFF")
			.text(function(d) { return d.valueAbsolute !== 0 && (d.x1-d.x0)>0.04 ? d.valueAbsolute : "" });
		
		
		var lineZero = d3.select("#axisZero"+nameVariable);
		lineZero.select("line").remove();
		
		lineZero.attr("class", "y axis")
			.append("line")
			.attr("x1", xScale(0))
			.attr("y1", margin.top)
			.attr("x2", xScale(0))
			.attr("y2", (height + margin.top));

		var legendGroup = d3.select("#"+nameVariable).selectAll(".legendGroup")
			.data(data.map( function(d){ return d.gender}))
			.attr("transform", function(d, i) { return "translate(" + ((width/data.length * i) + 5) + ",30)"; });
		
		legendGroup.enter()
			.append("g")
			.attr("class", "legendGroup")
			.attr("transform", function(d, i) { return "translate(" + ((width/data.length * i) + 5) + ",30)"; });
		
                var text = legendGroup.selectAll("text");
                text.remove();
                
		legendGroup.append("text")
			.attr("dy", ".35em")
			.style("text-anchor", "begin")
			.style("font-size", "16px")
                        .text(function(d) { return d.variable; })
                        //.attr("fill", "#FFF");
                        .attr("fill",function(d) { 
                            return d.color; });
			
		legendGroup.exit().remove();
		
	
		function KeyValueindex(array, key, value) {
			var FoundAt = -1;
			array.forEach(function (d, i) {
				if (d[key] == value) {
					FoundAt = i;
				}
			})

			return FoundAt > -1 ? FoundAt : -1;
		}
	}
	
	chart.data = function(value) {
		if(!arguments.length) return data;
		data = value;
		return chart;
	}
	
        chart.nameVariable = function(value) {
            if(!arguments.length) return nameVariable;
            nameVariable = value;
            return chart;
	}
        
        chart.width = function(value) {
            if(!arguments.length) return width;
            width = value;
            return chart;
	}
        
	return d3.rebind(chart, dispatch, "on");
}