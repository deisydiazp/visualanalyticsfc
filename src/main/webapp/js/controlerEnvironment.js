/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

var resolucionWidth = screen.width;
var resolucionHeight = screen.height;
var cantGraphsEntorno = 3; //para tres graficos horizontales
var padding = 50;// 20 derecha y 20 izquierda
var tamXGraph = 0;
var tamYGraph = 0;
var graphResumen;

//var lstGraphs = [];
var graphPercapita;

/*******************Entorno*************************/
tamXGraph = (resolucionWidth - (padding*4))/cantGraphsEntorno;

var svgEntorno = d3.select("#gbody").append("svg")
    .attr("id","g_entorno")
    .attr("width", resolucionWidth - (padding*2))
    .attr("height", 880);

svgEntorno.append("g")
    .append("text")
    .attr("class","title_section")
    .attr("x",0)
    .attr("y",0)
    .attr("dy","1em")
    .text("Características entorno")

svgEntorno.append("g")
    .attr("id","pesopapa")
    .attr("class","variableFilter")
    .attr("transform", "translate(0, 50)")

svgEntorno.append("g")
    .attr("id","pesomama")
    .attr("class","variableFilter")
    .attr("transform", "translate(0, 230)");

svgEntorno.append("g")
    .attr("id","edadmama")
    .attr("class","variableFilter")
    .attr("transform", "translate(0, 410)");
    
svgEntorno.append("g")
    .attr("id","tallapapa")
    .attr("class","variableFilter")
    .attr("transform", "translate(" + (padding + tamXGraph) + ", 50)");

svgEntorno.append("g")
    .attr("id","tallamama")
    .attr("class","variableFilter")
    .attr("transform", "translate(" + (padding + tamXGraph) + ", 230)");


svgEntorno.append("g")
    .attr("id","nivelpapa")
    .attr("class","variableFilter")
    .attr("transform", "translate(" + ((padding*2) + (tamXGraph*2)) + ", 50)");    
    
svgEntorno.append("g")
    .attr("id","nivelmama")
    .attr("class","variableFilter")
    .attr("transform", "translate(" + ((padding*2) + (tamXGraph*2)) + ", 180)");    
    
svgEntorno.append("g")
    .attr("id","embarazodeseado")
    .attr("class","variableFilter")
    .attr("transform", "translate(" + ((padding*2) + (tamXGraph*2)) + ", 310)");      
    
svgEntorno.append("g")
    .attr("id","primipara")
    .attr("class","variableFilter")
    .attr("transform", "translate(" + ((padding*2) + (tamXGraph*2)) + ", 440)");     

svgEntorno.append("g")
    .attr("id","percapitasalariominimo")
    .attr("transform", "translate(" + ((padding*2) + (tamXGraph*2)) + ", 570)");
    
svgEntorno.append("g")
    .attr("id","Centro")
    .attr("transform", "translate(" + ((padding*2) + (tamXGraph*2)) + ", 700)");

$("#g_entorno").css({top: 160});
$("#g_totalesprematuro").css({top: 180});

function getDataEnviroment(){

    lstGraphs = [];

    var variablesFiltroAux = leerCookie("filtroGeneral");
    if(variablesFiltroAux!=null)
        variablesFiltro = variablesFiltroAux;
    
    $( "#divVariablesFilter" ).html(showVariablesDivFilter());
    
    d3.select("#g_entorno").attr("class","background_none");
    d3.select("#g_tiempoResumen").attr("class","background_none");
    $.post("FilterServlet", JSON.stringify({variablesGroup:"entorno",variablesFiltro:variablesFiltro}), function(data){
        
        for(var i = 0; i < data.length; i++){

            groupGraph = d3.select("#"+data[i].nameVariable)
      
                
            if(data[i].typeGraph == "barHorizontal"){
                var graph = d3.chart.barHorizontal();
                graph.width(tamXGraph);
                graph.height(25);
                graph.labelVariable(data[i].label);
                graph.nameVariable(data[i].nameVariable);
                graph.filtered(existeFiltro(data[i].nameVariable));
                graph.data(data[i].categories);
                graph(groupGraph);
                lstGraphs.push({"nameVariable":data[i].nameVariable,"graph":graph});
            }
            
            if(data[i].typeGraph == "boxplot"){
                var graph = d3.chart.boxplot();
                graph.width(tamXGraph);
                graph.height(120);
                graph.labelVariable(data[i].label);
                graph.nameVariable(data[i].nameVariable);
                graph.filtered(existeFiltro(data[i].nameVariable));
                graph.data(data[i].categories);
                graph(groupGraph);
                lstGraphs.push({"nameVariable":data[i].nameVariable,"graph":graph});
            }
            
            if(data[i].typeGraph == "bar"){
                var graph = d3.chart.bar();
                graph.width(tamXGraph*2+padding);
                graph.height(200);
                graph.labelVariable(data[i].label);
                graph.nameVariable(data[i].nameVariable);
                graph.filtered(existeFiltro(data[i].nameVariable));
                graph.data(data[i].categories);
                graph(groupGraph);
                lstGraphs.push({"nameVariable":data[i].nameVariable,"graph":graph});
            }
            
            
        }
    });
    
    $.post("FilterRangeServlet", JSON.stringify({variablesGroup:'percapitasalariominimo' ,variablesFiltro:variablesFiltro}), function(data){
        
        groupGraph = d3.select("#percapitasalariominimo")
       
        graphPercapita = d3.chart.barHorizontal();
        graphPercapita.width(tamXGraph);
        graphPercapita.height(25);
        graphPercapita.labelVariable(data[0].label);
        graphPercapita.nameVariable(data[0].nameVariable);
        graphPercapita.filtered(existeFiltro(data[0].nameVariable));
        graphPercapita.data(data[0].categories);
        graphPercapita(groupGraph);
        
    });
    
    $.post("FilterTotal", JSON.stringify(variablesFiltro), function(data){
        
        var total = parseInt(data[0].categories[0].value);
        d3.select("#totalFilter").text("Total registros: " + total.toString());
        $("label[for='total_registros']").text(total.toString());
        for(var i=1; i<data.length; i++){
            for(var j=0; j<data[i].categories.length; j++){
                var category = data[i].categories[j];
                $("label[for='total_" + category.variable + "']").text(category.value.toString());
                var porcentaje = (parseInt(category.value)/total)*100;
                $("label[for='porcentaje_" + category.variable + "']").text((parseFloat(porcentaje).toFixed( 2 )).toString() + "%");
            }
         }
      
    });
    
    cargarGraficasTiempo();
}  

function updateData(){
    
    document.cookie = "filtroGeneral=" + JSON.stringify(variablesFiltro);
    
    d3.select("#g_entorno").attr("class","background_cargando");
    $.post("FilterServlet", JSON.stringify({variablesGroup:"entorno",variablesFiltro:variablesFiltro}), function(data){
        d3.select("#g_entorno").attr("class","background_none");
    
        for(var i = 0; i < data.length; i++){
            
            var resultGraph = $.grep(lstGraphs, function(e){ return e.nameVariable == data[i].nameVariable; });
            if (resultGraph.length != 0) {
                resultGraph[0].graph.data(data[i].categories);
                resultGraph[0].graph.nameVariable(data[i].nameVariable);
                resultGraph[0].graph.filtered(existeFiltro(data[i].nameVariable));
                resultGraph[0].graph.update();
            }
            
        }
    });
    
    $.post("FilterRangeServlet", JSON.stringify({variablesGroup:"percapitasalariominimo",variablesFiltro:variablesFiltro}), function(data){
       
        graphPercapita.nameVariable(data[0].nameVariable); 
        graphPercapita.filtered(existeFiltro(data[i].nameVariable))
        graphPercapita.data(data[0].categories);
        graphPercapita.update();    
        
    });
    
    $.post("FilterTotal", JSON.stringify(variablesFiltro), function(data){
        
        var total = parseInt(data[0].categories[0].value);
        d3.select("#totalFilter").text("Total registros: " + total.toString());
        
        d3.selectAll(".porcentaje").text("0%")
        d3.selectAll(".total").text("0")
        $("label[for='total_registros']").text(total.toString());
        for(var i=1; i<data.length; i++){
            for(var j=0; j<data[i].categories.length; j++){
                var category = data[i].categories[j];
                $("label[for='total_" + category.variable + "']").text(category.value.toString());
                var porcentaje = (parseInt(category.value)/total)*100;
                $("label[for='porcentaje_" + category.variable + "']").text((parseFloat(porcentaje).toFixed( 2 )).toString() + "%");
            }
         }
    });
}

function removeVariableFilter(nameVariable){
    
    eliminarVariablesFiltro(nameVariable);
    updateData();
}

function updateVariablesMatch(varMatch){
    
    agregarVariablesFiltro(varMatch);
    updateData();
 }

function getDataTrends(measure,gender){
    
    var variablesFilter =   {
                                
                                outlier : false,
                                gender : gender,
                                measure : measure,
                                filters : variablesFiltro
                                
                            }
    
    document.cookie = measure + gender + "=" + JSON.stringify(variablesFilter);
    referenciaVentana = window.open('growthTrends.html?trend='+measure + gender,'_blank','width=1000,height=600,scrollbars=YES');

}

function getDataTrendsCoord(measure,gender){
    
    var variablesFilter =   {
                                
                                outlier : false,
                                gender : gender,
                                measure : measure,
                                filters : variablesFiltro
                                
                            }
    
    document.cookie = measure + gender + "=" + JSON.stringify(variablesFilter);
    referenciaVentana = window.open('growthTrendsCoord.html?trendCoord='+measure + gender,'_blank','width=1000,height=600,scrollbars=YES');

}
