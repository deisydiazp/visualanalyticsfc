if(!d3.chart) d3.chart = {};

d3.chart.buttonClickBasic = function() {

    var data;
    var dispatch = d3.dispatch(chart, 'hover');
    var width;
    var height;
    var nameVariable;
    var labelVariable;
    var color;
    var g;
  
    function chart(container) {
            g = container;

            update();
    }
    chart.update = update;

    function update(){
       
        var buttons = g.selectAll("g");
        buttons.remove();
		
        // Add buttons
        buttons = g.selectAll("g")
                .data(data)
                .enter()
                .append("g")
                .attr('selected',function(d){return d.selected; })
				.attr('class','btns')
				.attr('fill', function(d){
     
                    if(d.selected == true)
                        return d.color; 
                    else
                        return "#ccc"
                })
                .attr("btn_"+nameVariable, function(d) { return d.value;});
                
        color=data[0].color;
        
        rects = buttons.append("rect")
                .attr("x", function(d,i){
                                return (i * width); 
                })
                .attr("y",0)
                .attr('width', width + "px")
                .attr('height', height +"px")
                
                
        text =  buttons.append("text")
                .style("fill", "#FFF") 
                .attr("x", function(d,i){	
                        return (i * width); 
                })
                .attr("y", 0)  
                .attr("dy", "1.3em") 
                .attr("dx", ".8em") 
                .text(function(d) { return d.label;});

        buttons.on("click", function(d) {
            
            d.selected = !d.selected;
            d3.select(this).attr("selected", d.selected);
            if(d.selected == true)
                d3.select(this).attr("fill",d.color);
            else
                d3.select(this).attr("fill","#CCCCCC");
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

    chart.highlight = function(isChecked) {
  
        if(isChecked==false){
            g.selectAll('.btns').attr("fill","#CCCCCC");
            g.selectAll('.btns').attr("selected",false);
        }
        else{
            g.selectAll('.btns').attr("fill",color);
            g.selectAll('.btns').attr("selected",true);
        }
        
        data.forEach( function(d){
            d.selected = isChecked;
        })
    }
    return d3.rebind(chart, dispatch, "on");
}

   