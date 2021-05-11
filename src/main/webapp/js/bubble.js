if(!d3.chart) d3.chart = {};
	
d3.chart.bubble = function(){
	var g;
	var data;
	var diameter;
	var dispatch = d3.dispatch("on");
	
	function chart(container){
		g = container
			.attr("id","bubbles")
		
		update();
	}
	chart.update = update;
	
	function update(){
	
		BubbleArray = new Array();
		data.forEach(function (d) {
			d.categories.forEach(function (b, i) {
				// checking if the category is already added 
				FoundAt = KeyValueindex(BubbleArray, "variable", b.variable);
				if (FoundAt > -1) {
					temp = BubbleArray[KeyValueindex(BubbleArray, "variable", b.variable)];
					temp.children.push({ "variable": d.variableGroup, "value": b.value, "color": "F0F0F0" });
				}
					//if not found new object is created and pushed into array
				else {
					temp = new Object();
					temp.variable = b.variable;
					temp.color = b.color;
					temp.border = b.border;
					temp.children = new Array();
					temp.children.push({ "variable": d.variableGroup, "value": b.value, "color": "F0F0F0" });
					BubbleArray.push(temp);
				}

			});
		}); 
	
		var Root = {};  
		Root.variable = "main"
		Root.color = "#f7fcb9"
        Root.children = BubbleArray;
         
		var pack = d3.layout.pack()
		.size([diameter - 4, diameter - 4]);
		
		var node = g.datum(Root).selectAll("g")
			.data(pack.nodes)
			.attr("class", function(d) { 
				return d.children ? "node" : "leaf node"; })
			.attr("transform", function(d) { return "translate(" + d.x + "," + d.y + ")"; });

		node.enter()
			.append("g")
			.attr("class", function(d) { 
				return d.children ? "node" : "leaf node"; })
			.attr("transform", function(d) { return "translate(" + d.x + "," + d.y + ")"; });
		
		node.exit().remove();
		
		titles = node.selectAll("title")
		titles.remove();
		
		node.append("title")
			.text(function(d) { 
					return d.variable + "\n" + d.value; 
				});
		
		circles = node.selectAll("circle")
		circles.remove();
		
		node.append("circle")
		  .attr("r", function(d) { return d.r; })
		  .attr("fill", function(d) { return d.color; })
		  .attr("stroke-width", "2px")
		  .attr("stroke", function(d) { 
				color = d.color;
				if(d.border == 1) 
					color = "red"; 
				if(d.border == 2)  
					color = "blue";
					
				return color; 
			})
		
		text = node.filter(function(d) { return !d.children; }).selectAll("text")
		text.remove();
		
		node.filter(function(d) { return !d.children; }).append("text")
			.attr("dy", "0.3em")
			.text(function(d) { return d.variable.substring(0, d.r / 3); });
		
		
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
        
        chart.diameter = function(value) {
		if(!arguments.length) return diameter;
		diameter = value;
		return chart;
	}
	return d3.rebind(chart, dispatch, "on");
}