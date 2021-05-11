/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

var resolucionWidth = screen.width;
var resolucionHeight = screen.height;
var cantGraphsEntorno = 3;
var cantGraphsPrematuro = 2;
//para tres graficos horizontales
var padding = 50;// 20 derecha y 20 izquierda
var tamXGraph = 0;
var tamYGraph = 0;


var variablesMatch = [
    {
        labelVariable: "Género",
        nameVariable:"sexo",
        valuesFilters:[2,1],
        valuesLabels:['Niña','Niño'],
        typeFilter:"or"
    },
    {
        labelVariable:"RCIU",
        nameVariable:"RCIUpesoFenton",
        valuesFilters:[0,1],
        valuesLabels:['No','Si'],
        typeFilter:"or"
    }
];
var lstGraphs = [];
var lstGraphsMedidasNacimiento = [];
var graphStacked;
var graphResumen;
var graphMedidaAlNacer1; //niños
var graphMedidaAlNacer2; //niñas
var graphPercapita;
var medidaAlNacer = "pesoalnacer";

/*******************Entorno*************************/
tamXGraph = (resolucionWidth - (padding*4))/cantGraphsEntorno;

var svgEntorno = d3.select("body").append("svg")
    .attr("id","g_entorno")
    .attr("width", resolucionWidth - (padding*2))
    .attr("height", 680);

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

/***************************************************/

/*******************embarazo(proceso)*************************/
var tamXGraph_embarazo = (resolucionWidth - (padding*2));

var svgEmbarazo = d3.select("body").append("svg")
.attr("id","g_embarazo")
.attr("width", resolucionWidth - (padding*2))
.attr("height", 300);

svgEmbarazo.append("g").append("text")
    .attr("class","title_section")
    .attr("x",0)
    .attr("y",0)
    .attr("dy","1em")
    .text("Características embarazo");

svgEmbarazo.append("g")
    .attr("id","numerocontrolprenatal")
    .attr("class","variableFilter")
    .attr("transform", "translate(0, 50)");


/*******************Prematuro*************************/
var tamXGraph_prematuro = (resolucionWidth - (padding*3))/cantGraphsPrematuro;

var svgPrematuro = d3.select("body").append("svg")
.attr("id","g_prematuro")
.attr("width", resolucionWidth - (padding*2))
.attr("height", 900);

svgPrematuro.append("g").append("text")
    .attr("class","title_section")
    .attr("x",0)
    .attr("y",0)
    .attr("dy","1em")
    .text("Características nacimiento");

svgPrematuro.append("text")
    .text("RCIU")
    .attr("dy","1em")
    .attr("transform", "translate(0,50)");

var data_buttonsrciu =   [	
                        {label:"Si", color: "#637939", value:1, selected:true},
                        {label:"No", color: "#b5cf6b", value:0, selected:true}
                    ] 

var g_buttonrciu = svgPrematuro.append("g")
    .attr("id","RCIUpesoFenton")
    .attr("transform", "translate(40,50)");

buttonsrciu = d3.chart.buttonClick();
buttonsrciu.data(data_buttonsrciu);
buttonsrciu.orient("horizontal");
buttonsrciu.width(50);
buttonsrciu.height(25);
buttonsrciu.nameVariable("RCIUpesoFenton");
buttonsrciu.labelVariable("RCIU");
buttonsrciu(g_buttonrciu); 

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
var g_buttonsedad = svgPrematuro.append("g")
    .attr("id","stackeddadgestacional")
    .attr("transform", "translate(180,50)");
    
buttonsedad = d3.chart.buttonBrush();
buttonsedad.data(data_buttonsedad);
buttonsedad.width(resolucionWidth - (padding*2)-200);
buttonsedad.height(25);
buttonsedad.filtered(false);
buttonsedad.nameVariable("edadgestacional");
buttonsedad.labelVariable("Edad Gest.");
buttonsedad(g_buttonsedad);


svgPrematuro.append("g")
    .attr("id","prematuro")
    .attr("transform", "translate(" + padding + ",100)");
   
svgPrematuro.append("g")
    .attr("id","medidaalnacer_1")
    .attr("transform", "translate(" + (tamXGraph_prematuro + (padding*2))+ ", 200)");
    
svgPrematuro.append("g")
    .attr("id","medidaalnacer_2")
    .attr("transform", "translate(" + (tamXGraph_prematuro + (padding*2))+ ", 500)");

/***************************************************/


/*********************Resumen años******************/
//var tamXGraph_resumen = (resolucionWidth - (padding*3))/cantGraphsPrematuro;

var svgResumen = d3.select("body").append("svg")
.attr("id","g_resumen")
.attr("width", resolucionWidth - (padding*2))
.attr("height", 600);

svgResumen.append("rect")
        .attr("x", 0)
        .attr("y", 0)
        .attr("height", 498)
        .attr("width", resolucionWidth - 2 - (padding*2))
        .style("stroke", "darkOrange")
        .style("fill", "rgb(242, 242, 242)")
        .style("stroke-width", 2);  

svgResumen.append("g").append("text")
    .attr("class","title_section")
    .attr("x",10)
    .attr("y",10)
    .attr("dy","1em")
    .text("Resumen por año");

tamXGraph_resumen = (resolucionWidth - (padding*2))/3
svgResumen.append("g")
    .attr("id","g_resumengraph")
    .attr("transform", "translate(20, 50)");
    
svgResumen.append("g")
    .attr("id","g_resumenindices")
    .attr("transform", "translate(" + ((tamXGraph_resumen * 2) + padding )+ ", 55)")
    
    
var imgResumenPeso = svgResumen.append("image")
    //.attr("x",(tamXGraph_resumen * 2) + ((tamXGraph_resumen - 320)/2) )
    .attr("x",(tamXGraph_resumen * 2) + padding )
    .attr("y",100) 
    .attr("height","120px") 
    .attr("width","120px") 
    .attr("xlink:href","images/btnPeso.jpg");
  
imgResumenPeso.on("click",function(){
    
    var measure = "peso";
    var variablesFilter =   {
                                outlier : false,
                                gender : 0, //no se esta teniendo en cuenta el genero para los resumenes
                                measure : measure,
                                filters : variablesMatch
                            }
    
    document.cookie = "resume_" + measure + "=" + JSON.stringify(variablesFilter);
    ventanaResumen = window.open('resumeMeasure.html?resumeMeasure=resume_'+measure,'_blank','width=1000,height=600,scrollbars=YES');
    
});

var imgResumenTalla = svgResumen.append("image")
    //.attr("x",((tamXGraph_resumen * 2) + 170) + ((tamXGraph_resumen - 320)/2) )
    .attr("x",(tamXGraph_resumen * 2) + padding + 130)
    .attr("y",100) 
    .attr("height","120px") 
    .attr("width","120px") 
    .attr("xlink:href","images/btnTalla.jpg");
  
imgResumenTalla.on("click",function(){
    
    var measure = "talla";
    var variablesFilter =   {
                                outlier : false,
                                gender : 0, //no se esta teniendo en cuenta el genero para los resumenes
                                measure : measure,
                                filters : variablesMatch
                            }
    
    document.cookie = "resume_" + measure + "=" + JSON.stringify(variablesFilter);
    ventanaResumen = window.open('resumeMeasure.html?resumeMeasure=resume_'+measure,'_blank','width=1000,height=600,scrollbars=YES');
    
});

var imgResumenPc = svgResumen.append("image")
    .attr("x",(tamXGraph_resumen * 2) + padding + 260)
    .attr("y",100) 
    .attr("height","120px") 
    .attr("width","120px") 
    .attr("xlink:href","images/btnPc.jpg");
  
imgResumenPc.on("click",function(){
    
    var measure = "pc";
    var variablesFilter =   {
                                outlier : false,
                                gender : 0, //no se esta teniendo en cuenta el genero para los resumenes
                                measure : measure,
                                filters : variablesMatch
                            }
    
    document.cookie = "resume_" + measure + "=" + JSON.stringify(variablesFilter);
    ventanaResumen = window.open('resumeMeasure.html?resumeMeasure=resume_'+measure,'_blank','width=1000,height=600,scrollbars=YES');
    
});

var imgResumenAlimentacion = svgResumen.append("image")
    //.attr("x",((tamXGraph_resumen * 2) + 170) + ((tamXGraph_resumen - 320)/2) )
    .attr("x",(tamXGraph_resumen * 2) + padding )
    .attr("y",240) 
    .attr("height","120px") 
    .attr("width","120px") 
    .attr("xlink:href","images/btnAlimentacion.jpg");
  
imgResumenAlimentacion.on("click",function(){
    
    var variablesFilter =   {
                                filters : variablesMatch
                            }
    
    document.cookie = "alimentacion=" + JSON.stringify(variablesFilter);
    ventanaResumen = window.open('resumeFeeding.html?resumeFeeding=alimentacion','_blank','width=1000,height=600,scrollbars=YES');
    
});

var imgResumenPesoInicial = svgResumen.append("image")
    //.attr("x",((tamXGraph_resumen * 2) + 300) + ((tamXGraph_resumen - 320)/2) )
    .attr("x",(tamXGraph_resumen * 2) + padding + 130)
    .attr("y",240) 
    .attr("height","120px") 
    .attr("width","120px") 
    .attr("xlink:href","images/btnPesoInicial.jpg");
    
imgResumenPesoInicial.on("click",function(){
    
    var variablesFilter =   {
                                filters : variablesMatch
                            }
    
    document.cookie = "pesoInicial=" + JSON.stringify(variablesFilter);
    ventanaResumen = window.open('resumeStartingWeight.html?resume=pesoInicial','_blank','width=1000,height=600,scrollbars=YES');
    
});

var imgResumenSankey = svgResumen.append("image")
    //.attr("x",((tamXGraph_resumen * 2) + 300) + ((tamXGraph_resumen - 320)/2) )
    .attr("x",(tamXGraph_resumen * 2) + padding + 260)
    .attr("y",240) 
    .attr("height","120px") 
    .attr("width","120px") 
    .attr("xlink:href","images/btnPesoInicial.jpg");
    
imgResumenPesoInicial.on("click",function(){
    
    var variablesFilter =   {
                                filters : variablesMatch
                            }
    
    document.cookie = "pesoInicial=" + JSON.stringify(variablesFilter);
    ventanaResumen = window.open('resumeStartingWeight.html?resume=pesoInicial','_blank','width=1000,height=600,scrollbars=YES');
    
});


/***************************************************/

$("#g_entorno").css({top: padding, left: padding, position:'absolute'});
$("#g_embarazo").css({top: 750, left: padding, position:'absolute'});
$("#g_prematuro").css({top: 1250, left: padding, position:'absolute'});
$("#g_resumen").css({top: 2080, left: padding, position:'absolute'});


function getDatafilter(){
    
    $("#g_totalesprematuro").css({top: 1100, left: padding, width: resolucionWidth - (padding*2), position:'absolute'});
    $("#g_selmedidasalnacer").css({top: 1350, left: ((resolucionWidth - (padding*2))/2) + 100, position:'absolute'});
    
    /**********************Tiempo***********************/
    tamXGraph_tiempo = resolucionWidth-200;
        
    var svgTiempo = d3.select("#g_tiempo")
        .attr("width", tamXGraph_tiempo)// 160 es el width de los botones de guardar y abrir
        .attr("transform", "translate(0,5)");
    
    svgTiempo.append("text")
        .attr("id","totalFilter")
        .attr("transform", "translate(" + (tamXGraph_tiempo-190) + ",5)")
        .attr("dy","0.9em")
        .style("font-size", "18px")
        .attr("fill","darkOrange");
    
    var g_buttonsyear = svgTiempo.append("g")
        .attr("id","anocat")
        .attr("transform", "translate(5,2)");

    $( "#divVariablesFilter" ).html(showVariablesDivFilter());
    /***************************************************/
    d3.select("#g_entorno").attr("class","background_none");
    d3.select("#g_embarazo").attr("class","background_none");
    $.post("FilterServlet", JSON.stringify({variablesGroup:"entorno",variablesMatch:variablesMatch}), function(data){
        
        for(var i = 0; i < data.length; i++){

            groupGraph = d3.select("#"+data[i].nameVariable)

            if(data[i].typeGraph == "barHorizontal"){
                var graph = d3.chart.barHorizontal();
                graph.width(tamXGraph);
                graph.height(25);
                graph.labelVariable(data[i].label);
                graph.nameVariable(data[i].nameVariable);
                graph.filtered(false);
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
                graph.filtered(false);
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
                graph.filtered(false);
                graph.data(data[i].categories);
                graph(groupGraph);
                lstGraphs.push({"nameVariable":data[i].nameVariable,"graph":graph});
            }
            
            if(data[i].nameVariable == "sexo"){
                var dataGender = data[i].categories;
                
                var total = 0;
                dataGender.forEach(function(d){
                    total += parseInt(d.value);
                });
                
                dataGender.forEach(function(d){
                    $("label[for='totalGenero_" + d.variable + "']").text(d.value.toString());
                    var porcentaje = (parseInt(d.value)/total)*100;
                    $("label[for='porcentajeGenero_" + d.variable + "']").text((parseFloat(porcentaje).toFixed( 2 )).toString() + "%");
                });
            }
            
            if(data[i].nameVariable == "RCIUpesoFenton"){
                var dataRCIU = data[i].categories;
                
                 var total = 0;
                dataRCIU.forEach(function(d){
                    total += parseInt(d.value);
                });
                
                dataRCIU.forEach(function(d){
                    $("label[for='totalRCIU_" + d.variable + "']").text(d.value.toString());
                    var porcentaje = (parseInt(d.value)/total)*100;
                    $("label[for='porcentajeRCIU_" + d.variable + "']").text((parseFloat(porcentaje).toFixed( 2 )).toString() + "%");
                });
            }
        }
    });
    
    d3.select("#g_prematuro").attr("class","background_none");
    $.post("FilterBoxPlotServlet", JSON.stringify({variablesGroup:medidaAlNacer ,variablesMatch:variablesMatch}), function(data){
        
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
        
    $.post("FilterStackedServlet", JSON.stringify(variablesMatch), function(data){
        
        groupGraph = d3.select("#prematuro")
            .attr("width", (resolucionWidth - (padding*2))/2)
            .attr("height", 900);

        graphStacked = d3.chart.stackedBarNegative();
        graphStacked.nameVariable("prematuro");
        graphStacked.width((resolucionWidth - (padding*2))/2);
        graphStacked.data(data);
        graphStacked(groupGraph);
    });
    
    $.post("FilterRangeServlet", JSON.stringify({variablesGroup:'percapitasalariominimo' ,variablesMatch:variablesMatch}), function(data){
        
        groupGraph = d3.select("#percapitasalariominimo")
       
        graphPercapita = d3.chart.barHorizontal();
        graphPercapita.width(tamXGraph);
        graphPercapita.height(25);
        graphPercapita.labelVariable(data[0].label);
        graphPercapita.nameVariable(data[0].nameVariable);
        graphPercapita.filtered(false);
        graphPercapita.data(data[0].categories);
        graphPercapita(groupGraph);
        
    });
    
    $.post("FilterTotal", JSON.stringify(variablesMatch), function(data){
        //$("label[for='totalFilter']").text("Total registros: " + data.toString());
        d3.select("#totalFilter").text("Total registros: " + data.toString());
    });
    
    d3.select("#g_resumen").attr("class","background_none");
    $.post("FilterServlet", JSON.stringify({variablesGroup:"tiempo",variablesMatch:null}), function(data){
        tamXGraph_resumen = (resolucionWidth - (padding*2))/3;
        
        groupGraph = d3.select("#g_resumengraph")
        graphResumen = d3.chart.bar();
        graphResumen.width(tamXGraph_resumen*2);
        graphResumen.height(350);
        graphResumen.labelVariable(data[0].label);
        graphResumen.nameVariable(data[0].nameVariable+"resumen");
        graphResumen.filtered(false);
        graphResumen.withBrush(false);
        graphResumen.data(data[0].categories);
        graphResumen(groupGraph);
        
        
        //Años
        var data_buttonsyear = [];
        for(var i=0; i<data[0].categories.length; i++){
            var año = data[0].categories[i];
            data_buttonsyear.push({'label':año.variable, 'labelCorto':año.variable.substring(2,4), 'variable':año.variable, 'color': "#8c564b", 'value':parseInt(año.variable)});
        }
                
        buttonsyear = d3.chart.buttonBrush();
        buttonsyear.data(data_buttonsyear);
        buttonsyear.width(tamXGraph_tiempo-205);
        buttonsyear.height(25);
        buttonsyear.nameVariable("ANOCAT");
        buttonsyear.labelVariable("Año Nac.");
        buttonsyear.filtered(false);
        buttonsyear(g_buttonsyear);

    });
}  

function updateData(){
    
    d3.select("#g_entorno").attr("class","background_cargando");
    d3.select("#g_embarazo").attr("class","background_cargando");
    $.post("FilterServlet", JSON.stringify({variablesGroup:"entorno",variablesMatch:variablesMatch}), function(data){
        d3.select("#g_entorno").attr("class","background_none");
        d3.select("#g_embarazo").attr("class","background_none");
    
        for(var i = 0; i < data.length; i++){
            
            var resultGraph = $.grep(lstGraphs, function(e){ return e.nameVariable == data[i].nameVariable; });
            if (resultGraph.length != 0) {
                resultGraph[0].graph.data(data[i].categories);
                resultGraph[0].graph.nameVariable(data[i].nameVariable);
                
                resultVariable = $.grep(variablesMatch, function(e){ return e.nameVariable == data[i].nameVariable; });
   
                if (resultVariable.length != 0) 
                    resultGraph[0].graph.filtered(true);
                else
                    resultGraph[0].graph.filtered(false);
                
           
                resultGraph[0].graph.update();
            }
            
            if(data[i].nameVariable == "sexo"){
                var dataGender = data[i].categories;
                
                var total = 0;
                dataGender.forEach(function(d){
                    total += parseInt(d.value);
                });
                
                $("label[for='totalGenero_1']").text("0");
                $("label[for='porcentajeGenero_1']").text("0%");
                $("label[for='totalGenero_2']").text("0");
                $("label[for='porcentajeGenero_2']").text("0%");
                
                dataGender.forEach(function(d){
                    $("label[for='totalGenero_" + d.variable + "']").text(d.value.toString());
                    var porcentaje = (parseInt(d.value)/total)*100;
                    $("label[for='porcentajeGenero_" + d.variable + "']").text((parseFloat(porcentaje).toFixed( 2 )).toString() + "%");
                });
            }
            
            if(data[i].nameVariable == "RCIUpesoFenton"){
                var dataRCIU = data[i].categories;
                
                var total = 0;
                dataRCIU.forEach(function(d){
                    total += parseInt(d.value);
                });
                
                $("label[for='totalRCIU_0']").text("0");
                $("label[for='porcentajeRCIU_0']").text("0%");
                $("label[for='totalRCIU_1']").text("0");
                $("label[for='porcentajeRCIU_1']").text("0%");
                
                dataRCIU.forEach(function(d){
                    $("label[for='totalRCIU_" + d.variable + "']").text(d.value.toString());
                    var porcentaje = (parseInt(d.value)/total)*100;
                    $("label[for='porcentajeRCIU_" + d.variable + "']").text((parseFloat(porcentaje).toFixed( 2 )).toString() + "%");
                });
            }
        }
    });
    
    d3.select("#g_prematuro").attr("class","background_cargando");
    $.post("FilterStackedServlet", JSON.stringify(variablesMatch), function(data){
        d3.select("#g_prematuro").attr("class","background_none");
        graphStacked.data(data);
        graphStacked.update();    
        
    });
    
    $.post("FilterRangeServlet", JSON.stringify({variablesGroup:"percapitasalariominimo",variablesMatch:variablesMatch}), function(data){
       
        resultVariable = $.grep(variablesMatch, function(e){ return e.nameVariable == data[0].nameVariable; });
   
        var filtered = false
        if (resultVariable.length != 0) 
            filtered = true;
         
        graphPercapita.nameVariable(data[0].nameVariable); 
        graphPercapita.filtered(filtered)
        graphPercapita.data(data[0].categories);
        graphPercapita.update();    
        
    });
    
    
    $.post("FilterBoxPlotServlet", JSON.stringify({variablesGroup:medidaAlNacer,variablesMatch:variablesMatch}), function(data){
        
        for(var i = 0; i < data.length; i++){

            lstGraphsMedidasNacimiento[i].graph.labelVariable(data[i].label);
            lstGraphsMedidasNacimiento[i].graph.nameVariable(data[i].nameVariable);
            lstGraphsMedidasNacimiento[i].graph.filtered(false);
            lstGraphsMedidasNacimiento[i].graph.data(data[i].categories);
            lstGraphsMedidasNacimiento[i].graph.update();
        }
    });
    
    
    $.post("FilterTotal", JSON.stringify(variablesMatch), function(data){
        
        d3.select("#totalFilter").text("Total registros: " + data.toString());
    });
    
    d3.select("#g_resumen").attr("class","background_cargando");
    $.post("FilterServlet", JSON.stringify({variablesGroup:"tiempo",variablesMatch:variablesMatch}), function(data){
        d3.select("#g_resumen").attr("class","background_none");
        graphResumen.data(data[0].categories);
        graphResumen.update();
        
    });
    
    resultVariable = $.grep(variablesMatch, function(e){ return e.nameVariable == "edadgestacional"; });
   
    if (resultVariable.length != 0) 
        buttonsedad.filtered(true);
    else
        buttonsedad.filtered(false);
    buttonsedad.marckFiltered();
    
    
    resultVariable = $.grep(variablesMatch, function(e){ return e.nameVariable == "ANOCAT"; });
   
    if (resultVariable.length != 0) 
        buttonsyear.filtered(true);
    else
        buttonsyear.filtered(false);
    buttonsyear.marckFiltered();
}

function showVariablesDivFilter(){
    
    var cadVariables = "";
    for(var i = 0; i < variablesMatch.length; i++){
        cadVariables += '<span class="list-group-item">' + variablesMatch[i].labelVariable + ' <span style="color:#5D6D7E">(';
        if(variablesMatch[i].valuesLabels != undefined)
            for(var j = 0 ; j < + variablesMatch[i].valuesLabels.length; j++){
                cadVariables += variablesMatch[i].valuesLabels[j] + ", ";
            }        
        else
            for(var j = 0 ; j < + variablesMatch[i].valuesFilters.length; j++){
                cadVariables += variablesMatch[i].valuesFilters[j].toString() + ", ";
            } 
        
        cadVariables += ') </span>';
        cadVariables = cadVariables.replace(', )',')');
        if(variablesMatch[i].nameVariable != "sexo" && variablesMatch[i].nameVariable != "RCIUpesoFenton")
            cadVariables += '<a href="javascript:removeVariableFilter(\'' + variablesMatch[i].nameVariable + '\')"><i class="fa fa-remove pull-right"></i></a>';
        
        cadVariables += '</span>';
    }
    
    return cadVariables;
}

function showVariablesDivSave(){
    
    var cadVariables = "";
    for(var i = 0; i < variablesMatch.length; i++){
        cadVariables += '<span class="list-group-item">' + variablesMatch[i].labelVariable + ' <span style="color:#5D6D7E">(';
        if(variablesMatch[i].valuesLabels != undefined)
            for(var j = 0 ; j < + variablesMatch[i].valuesLabels.length; j++){
                cadVariables += variablesMatch[i].valuesLabels[j] + ",";
            }        
        else
            for(var j = 0 ; j < + variablesMatch[i].valuesFilters.length; j++){
                cadVariables += variablesMatch[i].valuesFilters[j].toString() + ",";
            } 
        
        cadVariables += ')</span>';
        cadVariables = cadVariables.replace(',)',')');
        
        cadVariables += '</span>';
    }
    
    return cadVariables;

}

function saveEstadoConsulta(){
    
    var cadError = '';
    var nombreMuestra = $('#txtNombreMuestra').val().replace(/\s/g, '');
    if( nombreMuestra == ''){
        cadError += ' - Ingrese un nombre para la muestra'
    }
    
    var hayFiltros = false
    for(var i = 0; i < variablesMatch.length; i++){
        if(variablesMatch[i].nameVariable != 'sexo' && variablesMatch[i].nameVariable != 'RCIUpesoFenton'){
            hayFiltros = true;
            break;
        }
    }
    
    if(!hayFiltros)
        cadError += ' - No ha realizado ningún filtro';
    
    if(cadError == ''){
    
        var estadoConsultaGuardar = { 
            nameState : $('#txtNombreMuestra').val(),
            descriptionState : $('#txtDescripcionMuestra').val(),
            variablesFilter : variablesMatch
        };

        $.post("SaveStateConsultServlet", JSON.stringify(estadoConsultaGuardar), function(mensaje){

            if(!mensaje.includes("Error"))
                $("#btnGuardarConsulta").attr("disabled", true);
            else
                $("#btnGuardarConsulta").attr("disabled", false);

            $('#txtMensajeGuardar').text(mensaje);
        });
        
    }else{
        $('#txtMensajeGuardar').text(cadError);
    }
}

function openModalGuardar(){
    
    $("#divVariablesSave").html(showVariablesDivSave());
    $("#txtMensajeGuardar").text('');
    $("#btnGuardarConsulta").attr("disabled", false);
    $('#modalSave').modal('toggle');
    
}

function openModalAbrir(){
    
    $.post("GetStateConsultServlet", JSON.stringify('none'), function(data){
        /*var elementos=2;
        var paginas=data.length/elementos;
        if(data.length%elementos>0){
            paginas++;
        }
        var i1 = (num-1)*elementos;
        var i2 = num*elementos;*/
        var cadVariables = '<table class="table table-bordered"><tbody>';
        for(var i = 0;i < data.length; i++){
            cadVariables += '<tr>';
            cadVariables += '<td width="100px">' + data[i].dateCreate + '</td>';
            cadVariables += '<td>' + data[i].nameState + '</td>';
            cadVariables += '<td width="25px"><a href="javascript:openEstadoConsulta(\'' + data[i].id + '\')"><i class="fa fa-folder-open-o pull-right" style="font-size:20px"></i></a></td>';
            cadVariables += '</tr>';
        }
        cadVariables += '</tbody></table>';
        
        $("#divConsultasEstado").html(cadVariables);
        
    });
    
    $('#modalOpen').modal('toggle');
    
}

function openEstadoConsulta(idEstadoConsulta){
    
    $.post("GetStateConsultServlet", JSON.stringify(idEstadoConsulta), function(data){
        
        var estadoConsultaAbrir = [];
        var estadoFilters = data[0].variablesFilter;
        for(var i = 0; i< estadoFilters.length; i++){
            
            var varMatch = {
                labelVariable : estadoFilters[i].labelVariable,
                nameVariable : estadoFilters[i].nameVariable,
                valuesFilters : estadoFilters[i].valuesFilters,
                valuesLabels: estadoFilters[i].valuesLabels,
                typeFilter: estadoFilters[i].typeFilter
            }
            
            estadoConsultaAbrir.push(varMatch);
        }
        
        variablesMatch = estadoConsultaAbrir;
        $( "#divVariablesFilter" ).html(showVariablesDivFilter());
        updateData();
        
    });
    
    $('#modalOpen').modal('hide');
}

function removeVariableFilter(nameVariable){
    
    var varRemove = {
                        nameVariable:nameVariable
                    }

    updateVariablesMatch(varRemove, false);
}


function getMedidaAlNacer(nameVariableMedida){
   
    medidaAlNacer = nameVariableMedida;
    
    lstGraphsMedidasNacimiento = [];

    d3.select('#medidaalnacer_1').selectAll("*").remove();
    d3.select('#medidaalnacer_2').selectAll("*").remove();
    $.post("FilterBoxPlotServlet", JSON.stringify({variablesGroup:medidaAlNacer ,variablesMatch:variablesMatch}), function(data){
        
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

function updateVariablesMatch(varMatch, add){
 
    
    if(varMatch.nameVariable.includes("pesoalnacer") || varMatch.nameVariable.includes("tallaalnacer") || varMatch.nameVariable.includes("pcalnacer")){
        varMatch.nameVariable = varMatch.nameVariable.split("_")[0];
        if(varMatch.labelVariable != undefined){
            var label = varMatch.labelVariable;
            varMatch.labelVariable = label.substring(0,label.length -4);
        }
    }
    
    var resultVariable = $.grep(variablesMatch, function(e){ return e.nameVariable == varMatch.nameVariable; });
    var i = variablesMatch.indexOf(resultVariable[0]);
    
    if(i != -1) {
        variablesMatch.splice(i, 1);
    }
    
    if(add){
        variablesMatch.push(varMatch);
    }
    
    $( "#divVariablesFilter" ).html(showVariablesDivFilter());
     
    updateData();
 }

function getDataTrends(measure,gender){
    
    var variablesFilter =   {
                                
                                outlier : false,
                                gender : gender,
                                measure : measure,
                                filters : variablesMatch
                                
                            }
    
    document.cookie = measure + gender + "=" + JSON.stringify(variablesFilter);
    referenciaVentana = window.open('growthTrends.html?trend='+measure + gender,'_blank','width=1000,height=600,scrollbars=YES');

}

function getDataTrendsCoord(measure,gender){
    
    var variablesFilter =   {
                                
                                outlier : false,
                                gender : gender,
                                measure : measure,
                                filters : variablesMatch
                                
                            }
    
    document.cookie = measure + gender + "=" + JSON.stringify(variablesFilter);
    referenciaVentana = window.open('growthTrendsCoord.html?trendCoord='+measure + gender,'_blank','width=1000,height=600,scrollbars=YES');

}  
