/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

var resolucionWidth = screen.width;
var resolucionHeight = screen.height;
var cantGraphsPrematuro = 2; //para tres graficos horizontales
var padding = 50; // 20 derecha y 20 izquierda
var tamXGraph = 0;
var tamYGraph = 0;

//var lstGraphs = [];
var lstGraphsMedidasNacimiento = [];
var graphStackedPeso;
var graphStackedTalla;
var graphStackedPc;
var graphMedidaAlNacer1; //niños
var graphMedidaAlNacer2; //niñas
var medidaAlNacer = "pesoalnacer";

/*******************Prematuro*************************/
tamXGraph = (resolucionWidth - (padding*3))/cantGraphsPrematuro;

var svgGeneral = d3.select("#gbody").append("svg")
    .attr("id","g_general")
    .attr("width", resolucionWidth - (padding*2))
    .attr("height", 450);

svgGeneral.append("g").append("text")
    .attr("class","title_section")
    .attr("x",0)
    .attr("y",0)
    .attr("dy","1em")
    .text("Características nacimiento");

svgGeneral.append("g")
    .attr("id","cesarea")
    .attr("transform", "translate(0,70)");

svgGeneral.append("g")
    .attr("id","TotalDiasHospitalizacion")
    .attr("transform", "translate(0,200)");
    
svgGeneral.append("g")
    .attr("id","classificacionlubchenco")
    .attr("transform", "translate(" + (tamXGraph + padding) + ",50)");
    
var svgRCIU = d3.select("#gbody").append("svg")
    .attr("id","g_rciu")
    .attr("width", resolucionWidth - (padding*2))
    .attr("height", 2800);


var data_buttonsedad =   [	
                        {label:"sem24", labelCorto:"24", variable:"24", color: "#8c564b", value:24},
                        {label:"sem25", labelCorto:"25", variable:"25", color: "#8c564b", value:25},
                        {label:"sem26", labelCorto:"26", variable:"26", color: "#8c564b", value:26},
                        {label:"sem27", labelCorto:"27", variable:"27", color: "#8c564b", value:27},
                        {label:"sem28", labelCorto:"28", variable:"28", color: "#8c564b", value:28},
                        {label:"sem29", labelCorto:"29", variable:"29", color: "#8c564b", value:29},
                        {label:"sem30", labelCorto:"30", variable:"30", color: "#8c564b", value:30},
                        {label:"sem31", labelCorto:"31", variable:"31", color: "#8c564b", value:31},
                        {label:"sem32", labelCorto:"32", variable:"32", color: "#8c564b", value:32},
                        {label:"sem33", labelCorto:"33", variable:"33", color: "#8c564b", value:33},
                        {label:"sem34", labelCorto:"34", variable:"34", color: "#8c564b", value:34},
                        {label:"sem35", labelCorto:"35", variable:"35", color: "#8c564b", value:35},
                        {label:"sem36", labelCorto:"36", variable:"36", color: "#8c564b", value:36},
                        {label:"sem37", labelCorto:"37", variable:"37", color: "#8c564b", value:37},
                        {label:"sem38", labelCorto:"38", variable:"38", color: "#8c564b", value:38},
                        {label:"sem39", labelCorto:"39", variable:"39", color: "#8c564b", value:39},
                        {label:"sem40", labelCorto:"40", variable:"40", color: "#8c564b", value:40}
                    ] 
var g_buttonsedad = svgRCIU.append("g")
    .attr("id","stackeddadgestacional")
    .attr("transform", "translate(0,0)");
    
buttonsedad = d3.chart.buttonBrush();
buttonsedad.data(data_buttonsedad);
buttonsedad.width(resolucionWidth - (padding*2));
buttonsedad.height(25);
buttonsedad.filtered(existeFiltro("edadgestacional"));
buttonsedad.nameVariable("edadgestacional");
buttonsedad.labelVariable("Edad Gestacional");
buttonsedad(g_buttonsedad);

var dataRciu =      [	
                        {label:"Sí", labelCorto:"Sí", variable:"1", color: "#637939", value:1},
                        {label:"No", labelCorto:"No", variable:"0", color: "#b5cf6b", value:0}
                    ] 

var g_buttonrciu = svgRCIU.append("g")
    .attr("id","RCIUpesoFenton")
    .attr("transform", "translate(0,120)");

btnRciuPeso = d3.chart.buttonBrush();
btnRciuPeso.data(dataRciu);
btnRciuPeso.width(150);
btnRciuPeso.height(25);
btnRciuPeso.nameVariable("RCIUpesoFenton");
btnRciuPeso.labelVariable("RCIU peso Fenton");
btnRciuPeso(g_buttonrciu); 


svgRCIU.append("g")
    .attr("id","stackedPeso")
    .attr("transform", "translate(" + padding + ",200)");
   
svgRCIU.append("g")
    .attr("id","pesoalnacer_1")
    .attr("transform", "translate(" + (tamXGraph + (padding*2))+ ", 250)");
    
svgRCIU.append("g")
    .attr("id","pesoalnacer_2")
    .attr("transform", "translate(" + (tamXGraph + (padding*2))+ ", 550)");

g_buttonrciu = svgRCIU.append("g")
    .attr("id","RCIUtalla")
    .attr("transform", "translate(0,1000)");

btnRciuTalla = d3.chart.buttonBrush();
btnRciuTalla.data(dataRciu);
btnRciuTalla.width(150);
btnRciuTalla.height(25);
btnRciuTalla.nameVariable("RCIUtalla");
btnRciuTalla.labelVariable("RCIU talla Fenton");
btnRciuTalla(g_buttonrciu); 

svgRCIU.append("g")
    .attr("id","stackedTalla")
    .attr("transform", "translate(" + padding + ",1080)");
    
svgRCIU.append("g")
    .attr("id","tallaalnacer_1")
    .attr("transform", "translate(" + (tamXGraph + (padding*2))+ ", 1130)");
    
svgRCIU.append("g")
    .attr("id","tallaalnacer_2")
    .attr("transform", "translate(" + (tamXGraph + (padding*2))+ ", 1430)");    

g_buttonrciu = svgRCIU.append("g")
    .attr("id","RCIUPC")
    .attr("transform", "translate(0,1880)");
    
btnRciuPc = d3.chart.buttonBrush();
btnRciuPc.data(dataRciu);
btnRciuPc.width(150);
btnRciuPc.height(25);
btnRciuPc.nameVariable("RCIUPC");
btnRciuPc.labelVariable("RCIU PC Fenton");
btnRciuPc(g_buttonrciu); 

svgRCIU.append("g")
    .attr("id","stackedPc")
    .attr("transform", "translate(" + padding + ",1960)");

svgRCIU.append("g")
    .attr("id","pcalnacer_1")
    .attr("transform", "translate(" + (tamXGraph + (padding*2))+ ", 2010)");
    
svgRCIU.append("g")
    .attr("id","pcalnacer_2")
    .attr("transform", "translate(" + (tamXGraph + (padding*2))+ ", 2310)");

$("#g_general").css({top: 160});
$("#g_totalesprematuro").css({top: 180});
$("#g_rciu").css({top: 700});


function getDataBirth(){
    
    lstGraphs = [];
    
    var variablesFiltroAux = leerCookie("filtroGeneral");
    if(variablesFiltroAux!=null)
        variablesFiltro = variablesFiltroAux;

    $( "#divVariablesFilter" ).html(showVariablesDivFilter());    

    d3.select("#g_general").attr("class","background_none");
    $.post("FilterServlet", JSON.stringify({variablesGroup:"nacimiento",variablesFiltro:variablesFiltro}), function(data){
        
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
                graph.width(tamXGraph);
                graph.height(200);
                graph.labelVariable(data[i].label);
                graph.nameVariable(data[i].nameVariable);
                graph.filtered(existeFiltro(data[i].nameVariable));
                graph.data(data[i].categories);
                graph(groupGraph);
                lstGraphs.push({"nameVariable":data[i].nameVariable,"graph":graph});
            }
            
            if(data[i].typeGraph == "gridCircle2"){
                var graph = d3.chart.gridCircle2();
                graph.width(tamXGraph - padding);
                graph.height(330);
                graph.labelVariable(data[i].label);
                graph.nameVariable(data[i].nameVariable);
//                graph.filtered(false);
                graph.data(data[i].categories);
                graph(groupGraph);
                lstGraphs.push({"nameVariable":data[i].nameVariable,"graph":graph});
            }
            
        }
    });
    
    
    d3.select("#g_rciu").attr("class","background_none");
    $.post("FilterBoxPlotServlet", JSON.stringify({variablesGroup:"pesoalnacer" ,variablesFiltro:variablesFiltro}), function(data){
        
        for(var i = 0; i < data.length; i++){

            var nameMedida = data[i].nameVariable;//.replace(medidaAlNacer,'medidaalnacer')
            groupGraph = d3.select("#"+nameMedida)

            var graph = d3.chart.boxplot();
            graph.width(600);
            graph.height(200);
            graph.labelVariable(data[i].label);
            graph.nameVariable(data[i].nameVariable);
            graph.filtered(existeFiltro("pesoalnacer"));
            graph.withMedian(true);
            graph.data(data[i].categories);
            graph(groupGraph);
            lstGraphsMedidasNacimiento.push({"nameVariable":data[i].nameVariable,"graph":graph});
        }
    });
    
    $.post("FilterBoxPlotServlet", JSON.stringify({variablesGroup:"tallaalnacer" ,variablesFiltro:variablesFiltro}), function(data){
        
        for(var i = 0; i < data.length; i++){

            var nameMedida = data[i].nameVariable;//.replace(medidaAlNacer,'medidaalnacer')
            groupGraph = d3.select("#"+nameMedida)

            var graph = d3.chart.boxplot();
            graph.width(600);
            graph.height(200);
            graph.labelVariable(data[i].label);
            graph.nameVariable(data[i].nameVariable);
            graph.filtered(existeFiltro("tallaalnacer"));
            graph.withMedian(true);
            graph.data(data[i].categories);
            graph(groupGraph);
            lstGraphsMedidasNacimiento.push({"nameVariable":data[i].nameVariable,"graph":graph});
        }
    });
        
    $.post("FilterBoxPlotServlet", JSON.stringify({variablesGroup:"pcalnacer" ,variablesFiltro:variablesFiltro}), function(data){
        
        for(var i = 0; i < data.length; i++){

            var nameMedida = data[i].nameVariable;//.replace(medidaAlNacer,'medidaalnacer')
            groupGraph = d3.select("#"+nameMedida)

            var graph = d3.chart.boxplot();
            graph.width(600);
            graph.height(200);
            graph.labelVariable(data[i].label);
            graph.nameVariable(data[i].nameVariable);
            graph.filtered(existeFiltro("pcalnacer"));
            graph.withMedian(true);
            graph.data(data[i].categories);
            graph(groupGraph);
            lstGraphsMedidasNacimiento.push({"nameVariable":data[i].nameVariable,"graph":graph});
        }
    });
    
    $.post("FilterStackedServlet", JSON.stringify({variablesGroup:"RCIUpesoFenton",variablesFiltro:variablesFiltro}), function(data){
        groupGraph = d3.select("#stackedPeso")
            .attr("width", (resolucionWidth - (padding*2))/2)
            .attr("height", 900);

        graphStackedPeso = d3.chart.stackedBarNegative();
        graphStackedPeso.nameVariable("stackedPeso");
        graphStackedPeso.width((resolucionWidth - (padding*2))/2);
        graphStackedPeso.data(data);
        graphStackedPeso(groupGraph);
    });
    
    $.post("FilterStackedServlet", JSON.stringify({variablesGroup:"RCIUtalla",variablesFiltro:variablesFiltro}), function(data){
        groupGraph = d3.select("#stackedTalla")
            .attr("width", (resolucionWidth - (padding*2))/2)
            .attr("height", 900);

        graphStackedTalla = d3.chart.stackedBarNegative();
        graphStackedTalla.nameVariable("stackedTalla");
        graphStackedTalla.width((resolucionWidth - (padding*2))/2);
        graphStackedTalla.data(data);
        graphStackedTalla(groupGraph);
    });
    
    $.post("FilterStackedServlet", JSON.stringify({variablesGroup:"RCIUPC",variablesFiltro:variablesFiltro}), function(data){
        groupGraph = d3.select("#stackedPc")
            .attr("width", (resolucionWidth - (padding*2))/2)
            .attr("height", 900);

        graphStackedPc = d3.chart.stackedBarNegative();
        graphStackedPc.nameVariable("stackedPc");
        graphStackedPc.width((resolucionWidth - (padding*2))/2);
        graphStackedPc.data(data);
        graphStackedPc(groupGraph);
    });
    
    $.post("FilterTotal", JSON.stringify(variablesFiltro), function(data){
        var total = parseInt(data[0].categories[0].value);
        d3.select("#totalFilter").text("Total registros: " + total.toString());
        
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
    
    d3.select("#g_rciu").attr("class","background_cargando");
    $.post("FilterStackedServlet", JSON.stringify({variablesGroup:"RCIUpesoFenton",variablesFiltro:variablesFiltro}), function(dataStackedPeso){
        d3.select("#g_rciu").attr("class","background_none");
        graphStackedPeso.data(dataStackedPeso);
        graphStackedPeso.update();    
        
    });
    
    $.post("FilterStackedServlet", JSON.stringify({variablesGroup:"RCIUtalla",variablesFiltro:variablesFiltro}), function(dataStackedTalla){
        d3.select("#g_rciu").attr("class","background_none");
        graphStackedTalla.data(dataStackedTalla);
        graphStackedTalla.update();    
        
    });
    
    $.post("FilterStackedServlet", JSON.stringify({variablesGroup:"RCIUPC",variablesFiltro:variablesFiltro}), function(dataStackedPc){
        d3.select("#g_rciu").attr("class","background_none");
        graphStackedPc.data(dataStackedPc);
        graphStackedPc.update();    
        
    });
    
    $.post("FilterBoxPlotServlet", JSON.stringify({variablesGroup:"pesoalnacer",variablesFiltro:variablesFiltro}), function(dataPeso){
        
        for(var i = 0; i < dataPeso.length; i++){
            for(var j = 0; j < lstGraphsMedidasNacimiento.length; j++){
                if(dataPeso[i].nameVariable == lstGraphsMedidasNacimiento[j].nameVariable){
                    lstGraphsMedidasNacimiento[j].graph.labelVariable(dataPeso[i].label);
                    lstGraphsMedidasNacimiento[j].graph.nameVariable(dataPeso[i].nameVariable);
                    lstGraphsMedidasNacimiento[j].graph.filtered(existeFiltro("pesoalnacer"));
                    lstGraphsMedidasNacimiento[j].graph.data(dataPeso[i].categories);
                    lstGraphsMedidasNacimiento[j].graph.update();
                    break;
                }
            }
        }

    });
    
    $.post("FilterBoxPlotServlet", JSON.stringify({variablesGroup:"tallaalnacer",variablesFiltro:variablesFiltro}), function(dataTalla){
        
        for(var i = 0; i < dataTalla.length; i++){
            for(var j = 0; j < lstGraphsMedidasNacimiento.length; j++){
                if(dataTalla[i].nameVariable == lstGraphsMedidasNacimiento[j].nameVariable){
                    lstGraphsMedidasNacimiento[j].graph.labelVariable(dataTalla[i].label);
                    lstGraphsMedidasNacimiento[j].graph.nameVariable(dataTalla[i].nameVariable);
                    lstGraphsMedidasNacimiento[j].graph.filtered(existeFiltro("tallaalnacer"));
                    lstGraphsMedidasNacimiento[j].graph.data(dataTalla[i].categories);
                    lstGraphsMedidasNacimiento[j].graph.update();
                    break;
                }
            }
        }
    });
    
    $.post("FilterBoxPlotServlet", JSON.stringify({variablesGroup:"pcalnacer",variablesFiltro:variablesFiltro}), function(dataPc){
        
        for(var i = 0; i < dataPc.length; i++){
            for(var j = 0; j < lstGraphsMedidasNacimiento.length; j++){
                if(dataPc[i].nameVariable == lstGraphsMedidasNacimiento[j].nameVariable){
                    lstGraphsMedidasNacimiento[j].graph.labelVariable(dataPc[i].label);
                    lstGraphsMedidasNacimiento[j].graph.nameVariable(dataPc[i].nameVariable);
                    lstGraphsMedidasNacimiento[j].graph.filtered(existeFiltro("pcalnacer"));
                    lstGraphsMedidasNacimiento[j].graph.data(dataPc[i].categories);
                    lstGraphsMedidasNacimiento[j].graph.update();
                    break;
                }
            }
        }
    });
    
    d3.select("#g_general").attr("class","background_cargando");
    $.post("FilterServlet", JSON.stringify({variablesGroup:"nacimiento",variablesFiltro:variablesFiltro}), function(data){
        d3.select("#g_general").attr("class","background_none");
    
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

function getMedidaAlNacer(nameVariableMedida){
   
    medidaAlNacer = nameVariableMedida;
    
    lstGraphsMedidasNacimiento = [];

    d3.select('#medidaalnacer_1').selectAll("*").remove();
    d3.select('#medidaalnacer_2').selectAll("*").remove();
    $.post("FilterBoxPlotServlet", JSON.stringify({variablesGroup:medidaAlNacer ,variablesFiltro:variablesFiltro}), function(data){
        
        for(var i = 0; i < data.length; i++){

            var nameMedida = data[i].nameVariable.replace(medidaAlNacer,'medidaalnacer')
            groupGraph = d3.select("#"+nameMedida)

            var graph = d3.chart.boxplot();
            graph.width(600);
            graph.height(200);
            graph.labelVariable(data[i].label);
            graph.nameVariable(data[i].nameVariable);
            graph.filtered(false);
            graph.withMedian(true);
            graph.data(data[i].categories);
            graph(groupGraph);
            lstGraphsMedidasNacimiento.push({"nameVariable":data[i].nameVariable,"graph":graph});
        }
    });
}

function removeVariableFilter(nameVariable){
    
    eliminarVariablesFiltro(nameVariable);
    updateData();
}

function updateVariablesMatch(varMatch){
 
    
    if(varMatch.nameVariable.includes("pesoalnacer") || varMatch.nameVariable.includes("tallaalnacer") || varMatch.nameVariable.includes("pcalnacer")){
        varMatch.nameVariable = varMatch.nameVariable.split("_")[0];
        if(varMatch.labelVariable != undefined){
            var label = varMatch.labelVariable;
            varMatch.labelVariable = label.substring(0,label.length -4);
        }
    }
    
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

