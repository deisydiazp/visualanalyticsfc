if (!d3.chart)
    d3.chart = {};

d3.chart.sankey = function () {
    
    var g;
    var nodeWidth = 20;
    var nodePadding = 8;
    var size = [1, 1];
    var nodes = [];
    var links = [];
    var linkTooltipOffset = 62;
    var nodeTooltipOffset = 130;
    var tipLinks;	
    var tipNodes;
    var data;
    var labelVariable;
    var nameVariable;

    var dispatch = d3.dispatch(chart, "filter");
	
    function chart(container) {

        g = container;	
        g.append('text')
            .attr("x",0)
            .attr("y",-35)
            .attr("dy",".5em")
            .attr('font-family', '"Helvetica Neue",Helvetica,Arial,sans-serif')
            .attr('font-size', '1.2em')
            .attr("id","label"+nameVariable)
            .text(labelVariable );
     
        g.append("image")
            .attr("x",0)
            .attr("y",-40) 
            .attr("height","40px") 
            .attr("width","40px") 
            .attr("xlink:href","images/cargando.gif"); 
		
        tipLinks = d3.tip()
            .attr('class', 'd3-tip')
            .offset([-10,0]);
        
        tipLinks.html(function(d) {
            var title, candidate;
            if (data.links.indexOf(d.source.name) > -1) {
                    candidate = d.source.name;
                    title = d.target.name;
            } else {
                    candidate = d.target.name;
                    title = d.source.name;
            }
            var html =  '<div class="table-wrapper">'+
                    '<h1>'+title+'</h1>'+
                    '<table>'+
                            '<tr>'+
                                    '<td class="col-left">'+candidate+'</td>'+
                                    '<td align="right">'+d.value+'</td>'+
                            '</tr>'+
                    '</table>'+
                    '</div>';
            return html;
        });

        tipNodes = d3.tip()
            .attr('class', 'd3-tip d3-tip-nodes')
            .offset([-10, 0]);

        tipNodes.html(function(d) {
                var object = d3.entries(d),
                  nodeName = object[1].value,
                  linksTo = object[3].value,
                  linksFrom = object[4].value,
                  html;

                html =  '<div class="table-wrapper">'+
                          '<h1>'+nodeName+'</h1>'+
                          '<table>';
                if (linksFrom.length > 0 & linksTo.length > 0) {
                html+= '<tr><td><h2>Input:</h2></td><td></td></tr>'
                }
                for (i = 0; i < linksFrom.length; ++i) {
                html += '<tr>'+
                  '<td class="col-left">'+linksFrom[i].source.name+'</td>'+
                  '<td align="right">'+formatAmount(linksFrom[i].value)+'</td>'+
                '</tr>';
                }
                if (linksFrom.length > 0 & linksTo.length > 0) {
                html+= '<tr><td><h2>Output:</h2></td><td></td></tr>'
                }
                for (i = 0; i < linksTo.length; ++i) {
                html += '<tr>'+
                                  '<td class="col-left">'+linksTo[i].target.name+'</td>'+
                                  '<td align="right">'+formatAmount(linksTo[i].value)+'</td>'+
                                '</tr>';
                }
                html += '</table></div>';
                return html;
        });

        g.call(tipLinks);
        g.call(tipNodes);

        update();		
    }
	
    chart.update = update;
	
    function update() {	

        var	color = d3.scale.category20();

        var path = findPath();
        nodes = data.nodes;	
        links = data.links;
        layout(64);

        var link = g.selectAll("path")
            .data(data.links)
            .attr("d", path)
            .style("stroke", function(d){ return d.source.color; })
            .style("stroke-width", function(d) { return Math.max(1, d.dy); })
            .sort(function(a, b) { return b.dy - a.dy; })
            .on('mousemove', function(event) {
                    tipLinks
                    .style("top", (d3.event.pageY - linkTooltipOffset) + "px")
                    .style("left", function () {
                            var left = (Math.max(d3.event.pageX - linkTooltipOffset, 10)); 
                            left = Math.min(left, window.innerWidth - $('.d3-tip').width() - 20)
                            return left + "px"; 
                    })
            })
            .on('mouseover', tipLinks.show)
            .on('mouseout', tipLinks.hide);

        link.enter().append("path")
            .attr("class", "link")
            .attr("d", path)
            .style("stroke", function(d){ return d.source.color; })
            .style("stroke-width", function(d) { return Math.max(1, d.dy); })
            .sort(function(a, b) { return b.dy - a.dy; })
            .on('mousemove', function(event) {
                    tipLinks
                    .style("top", (d3.event.pageY - linkTooltipOffset) + "px")
                    .style("left", function () {
                            var left = (Math.max(d3.event.pageX - linkTooltipOffset, 10)); 
                            left = Math.min(left, window.innerWidth - $('.d3-tip').width() - 20)
                            return left + "px"; 
                    })
            })
           .on('mouseover', tipLinks.show)
           .on('mouseout', tipLinks.hide);   


        var node = g.selectAll(".node")
            .data(data.nodes)
            .attr("transform", function(d) {
                    return "translate(" + d.x + "," + d.y + ")";
            })
            .on('mousemove', function(event) {
                    tipNodes
                    .style("top", (d3.event.pageY - $('.d3-tip-nodes').height() - 20) + "px")
                    .style("left", function () {
                            var left = (Math.max(d3.event.pageX - nodeTooltipOffset, 10)); 
                            left = Math.min(left, window.innerWidth - $('.d3-tip').width() - 20)
                            return left + "px"; 
                    })
            })
            .on('mouseover', tipNodes.show)
            .on('mouseout', tipNodes.hide)
            .call(d3.behavior.drag()
            .origin(function(d) { return d; })
            .on("dragstart", function() { 
                    d3.event.sourceEvent.stopPropagation();  //Disable drag sankey on node select
                    this.parentNode.appendChild(this);
            })
            .on("drag", dragmove));

        node.enter().append("g")
            .attr("class", "node")
            .attr("transform", function(d) {
                    return "translate(" + d.x + "," + d.y + ")";
            })
            .on('mousemove', function(event) {
                    tipNodes
                    .style("top", (d3.event.pageY - $('.d3-tip-nodes').height() - 20) + "px")
                    .style("left", function () {
                            var left = (Math.max(d3.event.pageX - nodeTooltipOffset, 10)); 
                            left = Math.min(left, window.innerWidth - $('.d3-tip').width() - 20)
                            return left + "px"; 
                    })
            })
            .on('mouseover', tipNodes.show)
            .on('mouseout', tipNodes.hide)
            .call(d3.behavior.drag()
            .origin(function(d) { return d; })
            .on("dragstart", function() { 
                    d3.event.sourceEvent.stopPropagation();  //Disable drag sankey on node select
                    this.parentNode.appendChild(this);
            })
            .on("drag", dragmove));

        var rect = node.selectAll("rect")
        rect.remove();
        var textValue = node.selectAll("text.nodeValue")
        textValue.remove();   
        var textLabel = node.selectAll("text.nodeLabel")
        textLabel.remove();  

        node.append("rect")
            .attr("height", function(d) { return d.dy; })
            .attr("width", nodeWidth)
            .style("fill", function(d) {
                    if (d.color == undefined)
                            return d.color = color(d.name.replace(/ .*/, "")); //get new color if node.color is null
                    return d.color;
            })
            .style("stroke", function(d) { return d3.rgb(d.color).darker(2); });

        node.append("text")
            .attr("class","nodeValue")
            .text(function(d) { return d.name + "\n" + d.value});

        node.selectAll("text.nodeValue")
            .attr("x", nodeWidth / 2)
            .attr("y", function (d) { return (d.dy / 2) })
            .text(function (d) { return d.value; })
            .attr("dy", 5)
            .attr("text-anchor", "middle");

        node.append("text")
            .attr("class","nodeLabel");

        node.selectAll("text.nodeLabel")	
            .attr("x", -6)
            .attr("y", function(d) { return d.dy / 2; })
            .attr("dy", ".35em")
            .attr("text-anchor", "end")
            .attr("transform", null)
            .text(function(d) { return d.name; })
            .filter(function(d) { return d.x < 1000 / 2; }) //ojo width
            .attr("x", 6 + nodeWidth)
            .attr("text-anchor", "start");


        function dragmove(d) {
                d3.select(this)
                .attr("transform", "translate(" + d.x + "," +
                   (d.y = Math.max(0, Math.min(height - d.dy, d3.event.y))) + ")");
                relayout();
                link.attr("d", path);
        };

    }

    function formatAmount(val) {
            //return val.toLocaleString("en-US", {style: 'currency', currency: "USD"}).replace(/\.[0-9]+/, "");
            return parseInt(val);
    };

    function layout(iterations) {
            computeNodeLinks();
            computeNodeValues();
            computeNodeBreadths();
            computeNodeDepths(iterations);
            computeLinkDepths();
            //return sankey;
    };

    function relayout() {
            computeLinkDepths();
            //return sankey;
    };

    function findPath() {
            var curvature = .5;

            function link(d) {
              var x0 = d.source.x + d.source.dx,
                    x1 = d.target.x,
                    xi = d3.interpolateNumber(x0, x1),
                    x2 = xi(curvature),
                    x3 = xi(1 - curvature),
                    y0 = d.source.y + d.sy + d.dy / 2,
                    y1 = d.target.y + d.ty + d.dy / 2;
              return "M" + x0 + "," + y0 + "C" + x2 + "," + y0 + " " + x3 + "," + y1 + " " + x1 + "," + y1;
            }

            link.curvature = function(_) {
              if (!arguments.length) return curvature;
              curvature = +_;
              return link;
            };

            return link;
    };

    // Populate the sourceLinks and targetLinks for each node.
    // Also, if the source and target are not objects, assume they are indices.
    function computeNodeLinks() {
            nodes.forEach(function(node) {
                    node.sourceLinks = [];
                    node.targetLinks = [];
            });
            links.forEach(function(link) {
                    var source = link.source,
                    target = link.target;
                    if (typeof source === "number") source = link.source = nodes[link.source];
                    if (typeof target === "number") target = link.target = nodes[link.target];
                    source.sourceLinks.push(link);
                    target.targetLinks.push(link);
            });
    }

    // Compute the value (size) of each node by summing the associated links.
    function computeNodeValues() {
            nodes.forEach(function(node) {
                    node.value = Math.max(
                            d3.sum(node.sourceLinks, value),
                            d3.sum(node.targetLinks, value));
            });
    }

    // Iteratively assign the breadth (x-position) for each node.
    // Nodes are assigned the maximum breadth of incoming neighbors plus one;
    // nodes with no incoming links are assigned breadth zero, while
    // nodes with no outgoing links are assigned the maximum breadth.
    function computeNodeBreadths() {
            var remainingNodes = nodes,
            nextNodes,
            x = 0;

            while (remainingNodes.length) {
                    nextNodes = [];
                    remainingNodes.forEach(function(node) {
                            node.x = x;
                            node.dx = nodeWidth;
                            node.sourceLinks.forEach(function(link) {
                                    nextNodes.push(link.target);
                            });
                    });
                    remainingNodes = nextNodes;
                    ++x;
            }

            //
            moveSinksRight(x);
            scaleNodeBreadths((size[0] - nodeWidth) / (x - 1));
    }

    function moveSourcesRight() {
            nodes.forEach(function(node) {
                    if (!node.targetLinks.length) {
                            node.x = d3.min(node.sourceLinks, function(d) {
                                    return d.target.x;
                            }) - 1;
                    }
            });
    }

    function moveSinksRight(x) {
            nodes.forEach(function(node) {
                    if (!node.sourceLinks.length) {
                            node.x = x - 1;
                    }	
            });
    }

    function scaleNodeBreadths(kx) {
            nodes.forEach(function(node) {
                    node.x *= kx;
            });
    }

    function computeNodeDepths(iterations) {
            var nodesByBreadth = d3.nest()
                    .key(function(d) {
                    return d.x;
            })
            .sortKeys(d3.ascending)
            .entries(nodes)
            .map(function(d) {
                    return d.values;
            });

    //
            initializeNodeDepth();
            resolveCollisions();
            for (var alpha = 1; iterations > 0; --iterations) {
                    relaxRightToLeft(alpha *= .99);
                    resolveCollisions();
                    relaxLeftToRight(alpha);
                    resolveCollisions();
            }

            function initializeNodeDepth() {
                    var ky = d3.min(nodesByBreadth, function(nodes) {
                            return (size[1] - (nodes.length - 1) * nodePadding) / d3.sum(nodes, value);
                    });

                    nodesByBreadth.forEach(function(nodes) {
                            nodes.forEach(function(node, i) {
                                    node.y = i;
                                    node.dy = node.value * ky;
                            });
                    });

                    links.forEach(function(link) {
                    link.dy = link.value * ky;
              });
            }

            function relaxLeftToRight(alpha) {
                    nodesByBreadth.forEach(function(nodes, breadth) {
                            nodes.forEach(function(node) {
                                    if (node.targetLinks.length) {
                                            var y = d3.sum(node.targetLinks, weightedSource) / d3.sum(node.targetLinks, value);
                                            node.y += (y - center(node)) * alpha;
                                    }
                            });
                    });

                    function weightedSource(link) {
                            return center(link.source) * link.value;
                    }
            }

            function relaxRightToLeft(alpha) {
                    nodesByBreadth.slice().reverse().forEach(function(nodes) {
                            nodes.forEach(function(node) {
                                    if (node.sourceLinks.length) {
                                            var y = d3.sum(node.sourceLinks, weightedTarget) / d3.sum(node.sourceLinks, value);
                                            node.y += (y - center(node)) * alpha;
                                    }
                            });
                    });

                    function weightedTarget(link) {
                            return center(link.target) * link.value;
                    }
            }

            function resolveCollisions() {
                    nodesByBreadth.forEach(function(nodes) {
                            var node,
                              dy,
                              y0 = 0,
                              n = nodes.length,
                              i;

                            // Push any overlapping nodes down.
                            nodes.sort(ascendingDepth);
                            for (i = 0; i < n; ++i) {
                                    node = nodes[i];
                                    dy = y0 - node.y;
                                    if (dy > 0) node.y += dy;
                                    y0 = node.y + node.dy + nodePadding;
                            }

                            // If the bottommost node goes outside the bounds, push it back up.
                            dy = y0 - nodePadding - size[1];
                            if (dy > 0) {
                                    y0 = node.y -= dy;

                                    // Push any overlapping nodes back up.
                                    for (i = n - 2; i >= 0; --i) {
                                            node = nodes[i];
                                            dy = node.y + node.dy + nodePadding - y0;
                                            if (dy > 0) node.y -= dy;
                                            y0 = node.y;
                                    }
                            }
                    });
            }

            function ascendingDepth(a, b) {
                    return a.y - b.y;
            }
    }

    function computeLinkDepths() {
            nodes.forEach(function(node) {
                    node.sourceLinks.sort(ascendingTargetDepth);
                    node.targetLinks.sort(ascendingSourceDepth);
            });
            nodes.forEach(function(node) {
                    var sy = 0,
                    ty = 0;
                    node.sourceLinks.forEach(function(link) {
                            link.sy = sy;
                            sy += link.dy;
                    });
                    node.targetLinks.forEach(function(link) {
                            link.ty = ty;
                            ty += link.dy;
                    });
            });

        function ascendingSourceDepth(a, b) {
            return a.source.y - b.source.y;
        }

        function ascendingTargetDepth(a, b) {
            return a.target.y - b.target.y;
        }
    }										

    function center(node) {
        return node.y + node.dy / 2;
    }

    function value(link) {
        return link.value;
    }

    chart.data = function(value) {
        if (!arguments.length) return data;
        data = value;
        return chart;
    };

    chart.nodeWidth = function(value) {
        if (!arguments.length) return nodeWidth;
        nodeWidth = value;
        return chart;
    };

    chart.nodePadding = function(value) {
        if (!arguments.length) 
                return nodePadding;
        nodePadding = value;
        return chart;
    };

    chart.nodes = function(value) {
        if (!arguments.length) 
                return nodes;
        nodes = value;
        return chart;
    };

    chart.links = function(value) {
        if (!arguments.length) 
                return links;
        links = value;
        return chart;
    };

    chart.size = function(value) {
        if (!arguments.length) 
                return size;
        size = value;
        return chart;
    };

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
    return d3.rebind(chart, dispatch, "on");
}