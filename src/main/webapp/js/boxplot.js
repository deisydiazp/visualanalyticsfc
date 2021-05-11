if(!d3.chart) d3.chart = {};

d3.chart.boxplot = function(){
    var g;
    var data;
    var width;
    var height;
    var labelVariable;
    var sizeLabel = 20;
    var midline;
    var nameVariable;
    var filtered;
    var withMedian = false;

    var dispatch = d3.dispatch(chart, "hover");
	
    function chart(container){
        
        midline = (height / 2) + sizeLabel;
        
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

        g.append("line")
            .attr("id","lineLower");

        g.append("line")
            .attr("id","lineUpper");

        g.append("line")
            .attr("id","lineHorizonal");

        g.append("rect")
            .attr("id","box");

        g.append("line")
            .attr("id","lineMedian");

        g.append("g")
            .attr("id","gCircles");

        g.append("text")
            .attr("class","textMedian");
    
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
        
        
        var dataComplete = data;

        data = data.map(function(d) {
                return parseFloat(d.variable);
          });

        data = data.sort(d3.ascending);

        var xScale = d3.scale.linear()
            .range([0, width]);  

        var brush;    
        var gBrush = g.select("#gBrush"+nameVariable)
        brush = d3.svg.brush()
        brush.x(xScale);
        brush(gBrush);
        gBrush.selectAll("rect").attr("height", 25).attr("y", height);
        
        var xAxis = d3.svg.axis()
            .scale(xScale)
            .orient("bottom");

        var outliers = [];
        var minVal = Infinity;
        var lowerWhisker = Infinity;
        var q1Val = Infinity;
        var medianVal = 0;
        var q3Val = -Infinity;
        var iqr = 0;
        var upperWhisker = -Infinity;
        var maxVal = -Infinity;

        //calculate the boxplot statistics
        minVal = data[0],
        q1Val = d3.quantile(data, .25),
        medianVal = d3.quantile(data, .5),
        q3Val = d3.quantile(data, .75),
        iqr = q3Val - q1Val,
        maxVal = data[data.length - 1];

        var index = 0;

        //search for the lower whisker, the mininmum value within q1Val - 1.5*iqr
        while (index < data.length && lowerWhisker == Infinity) {

                if (data[index] >= (q1Val - 1.5*iqr))
                        lowerWhisker = data[index];
                else
                        outliers.push(data[index]);

                index++;
        }

        index = data.length-1; // reset index to end of array

        //search for the upper whisker, the maximum value within q1Val + 1.5*iqr
        while (index >= 0 && upperWhisker == -Infinity) {

                if (data[index] <= (q3Val + 1.5*iqr))
                        upperWhisker = data[index];
                else
                        outliers.push(data[index]);

                index--;
        }

        //map the domain to the x scale +10%

        xScale.domain([minVal -(maxVal*0.10),maxVal*1.10]);
        //xScale.domain([420 -(5000*0.10),5000*1.10]);
     
        //append the axis
        var xg = g.select(".xaxis")
                .classed("axis",true)
                .attr("transform", "translate(0, " + height + ")")
                .call(xAxis);	

        //draw verical line for lowerWhisker
        g.select("#lineLower")
                .attr("class", "whisker")
                .attr("x1", xScale(lowerWhisker))
                .attr("x2", xScale(lowerWhisker))
                .attr("stroke", "black")
                .attr("y1", midline - (height/4))
                .attr("y2", midline + (height/4));



        //draw vertical line for upperWhisker
        g.select("#lineUpper")
                .attr("class", "whisker")
                .attr("x1", xScale(upperWhisker))
                .attr("x2", xScale(upperWhisker))
                .attr("stroke", "black")
                .attr("y1", midline - (height/4))
                .attr("y2", midline + (height/4));

        //draw horizontal line from lowerWhisker to upperWhisker
        g.select("#lineHorizonal")
                .attr("class", "whisker")
                .attr("x1",  xScale(lowerWhisker))
                .attr("x2",  xScale(upperWhisker))
                .attr("stroke", "black")
                .attr("y1", midline)
                .attr("y2", midline);

        //draw rect for iqr
        g.select("#box")    
                .attr("class", "box")
                .attr("stroke", "black")
                .attr("fill", "white")
                .attr("x", xScale(q1Val))
                .attr("y", midline - (height/4))
                .attr("width", xScale(q3Val) - xScale(q1Val))
                .attr("height", (height/2));
                

        //draw vertical line at median
        if(withMedian==true){
            g.select("#lineMedian")
                .attr("class", "median")
                .attr("stroke", "black")
                .attr("x1", xScale(medianVal))
                .attr("x2", xScale(medianVal))
                .attr("y1", midline - (height/2))
                .attr("y2", height);
        
                
            g.select(".textMedian")
                    .text(medianVal)
                    .attr("x",xScale(medianVal))
                    .attr("y",midline - (height/2))
                    .attr("fill", "#FA5858")
        }else{
            g.select("#lineMedian")
                .attr("class", "median")
                .attr("stroke", "black")
                .attr("x1", xScale(medianVal))
                .attr("x2", xScale(medianVal))
                .attr("y1", midline - (height/4))
                .attr("y2", midline + (height/4));
        }
    

        //draw data as points
        var circles = g.select("#gCircles").selectAll("circle")
                .data(dataComplete)     
                .attr("class", function(d) {
                        if (parseFloat(d.variable) < lowerWhisker || parseFloat(d.variable) > upperWhisker)
                                return "outlier";
                        else 
                                return "point";
                })     
                .attr("cy", function(d) {
                        return random_jitter();
                }) 
                .attr("cx", function(d) {
                        return xScale(parseFloat(d.variable));   
                })

        var textCircles = g.select("#gCircles").selectAll("title")
                .data(dataComplete)  
                .text(function(d) {
                        return labelVariable + ": " + d.variable + "  Cantidad: " + d.value;
                })

        circles.enter()
                .append("circle")
                .attr("r", 2.5)
                .attr("class", function(d) {
                        if (parseFloat(d.variable) < lowerWhisker || parseFloat(d.variable) > upperWhisker)
                                return "outlier";
                        else 
                                return "point";
                        })     
                .attr("cy", function(d) {
                        return random_jitter();
                }) 
                .attr("cx", function(d) {
                        return xScale(parseFloat(d.variable));   
                })
                .append("title")
                .text(function(d) {
                        return labelVariable + ": " + d.variable + "  Cantidad: " + d.value;
                });

        circles.exit().remove();

        
        brush.on("brushend", function() {

            var ext = brush.extent()

            var varMatch = {
                labelVariable:labelVariable,
                nameVariable:nameVariable,
                valuesFilters:[ parseInt(ext[0]), parseInt(ext[1])],
                typeFilter:"range"
            }

            updateVariablesMatch(varMatch, true);

        })
        
    }
	
    function random_jitter() {
        var seed;
        if (Math.round(Math.random() * 1) == 0)
                seed = -(height/4);
        else
                seed = (height/4); 

        return midline + Math.floor((Math.random() * seed) + 1);
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
    
    chart.withMedian = function(value) {
        if(!arguments.length) return withMedian;
        withMedian = value;
        return chart;
    }
    
    return d3.rebind(chart, dispatch, "on");
}

