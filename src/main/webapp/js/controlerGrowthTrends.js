/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

var graphTrends;
var graphTrendsAli;
var resolucionWidth = screen.width;
var widthParallelCoord = 3030;
var padding = 30;
var variablesFiltroTendencias;
var graphNormalized = false;
var buttonsyear;

var svgTendencias = d3.select("body").append("svg")
    .attr("id","parallelCoordinates")
    .attr("transform", "translate(0,0)")
    .attr("width", widthParallelCoord)
    .attr("height", 890);

var textTitle = svgTendencias.append("g").append("text")
     .attr("class","title_section")
    .attr("x",0)
    .attr("y",0)
    .attr("dy","1em");

/************************** textos resumen *********************************/

var svgTextosTotales = d3.select("body").append("svg")
    .attr("id","g_textosTotales")
    .attr("height", 500)
    .attr("width", 400)
    .style("background-color","#F2F2F2");

svgTextosTotales.append("rect")
        .attr("x", 0)
        .attr("y", 0)
        .attr("height", 498)
        .attr("width", 398)
        .style("stroke", "darkOrange")
        .style("fill", "none")
        .style("stroke-width", 2);    

svgTextosTotales.append("g").append("text")
    .attr("class","title_section")
    .attr("x",20)
    .attr("y",10)
    .attr("dy","1em")
    .text("Totales");    

svgTextosTotales.append("text")
    .attr("id","totalTrends")
    .attr("transform", "translate(20,70)")
    .attr("dy","0.9em")
    .style("font-size", "18px")
    .attr("fill","green");

 svgTextosTotales.append("text")
    .attr("id","totalOutlier")
    .attr("transform", "translate(20,100)")
    .attr("dy","0.6em")
    .style("font-size", "18px"); 

svgTextosTotales.append("text")
    .attr("id","totalError")
    .attr("transform", "translate(20,130)")
    .attr("dy","0.6em")
    .style("font-size", "18px"); 

svgTextosTotales.append("text")
    .attr("id","totalRegistros")
    .attr("transform", "translate(20,160)")
    .attr("dy","0.6em")
    .style("font-size", "18px"); 

svgTextosTotales.append("text")
    .attr("id","totalSelect")
    .attr("transform", "translate(20,190)")
    .attr("dy","0.6em")
    .style("font-size", "18px")
    .attr("fill","green");   

changeTrends = function(){
    graphNormalized = !graphNormalized;
    updateDataParallelCordinates();
}

var gCheckNormalized = svgTextosTotales.append("g");
var cbxNormalized = d3.chart.checkBox();
cbxNormalized.x(20);
cbxNormalized.y(350);
cbxNormalized.boxStrokeWidth(1);
cbxNormalized.size(25);
cbxNormalized.checked(graphNormalized);
cbxNormalized.clickEvent(changeTrends);
cbxNormalized(gCheckNormalized);

svgTextosTotales.append("text")
    .text("Datos normalizados")
    .attr("x",55)
    .attr("y",350)
    .attr("dy","1em")
    .style("font-size", "18px");


changeOutlier = function(){
    
    variablesFiltroTendencias.outlier =  !variablesFiltroTendencias.outlier;
    document.cookie = nameTrend + "=" + JSON.stringify(variablesFiltroTendencias);

    updateDataParallelCordinates()
}

var gCheckOutlier = svgTextosTotales.append("g");
var cbxOutlier = d3.chart.checkBox();
cbxOutlier.x(20);
cbxOutlier.y(390);
cbxOutlier.boxStrokeWidth(1);
cbxOutlier.size(25);
cbxOutlier.checked(false);
cbxOutlier.clickEvent(changeOutlier);
cbxOutlier(gCheckOutlier);

svgTextosTotales.append("text")
    .text("Outlier")
    .attr("x",55)
    .attr("y",390)
    .attr("dy","1em")
    .style("font-size", "18px");


/******************Tendencias Alimentacion**********************************************/
var svgAlimentacionTrends = d3.select("body").append("svg")
    .attr("id","g_alimentacionTrends")
    .attr("width", 950)
    .attr("height", 600);

svgAlimentacionTrends.append("g").append("text")
     .attr("class","title_section")
    .attr("x",0)
    .attr("y",0)
    .attr("dy","1em")
    .text("Tendencias alimentación");  

 svgAlimentacionTrends.append("g")
    .attr("id","aliTendenciasSelect")
    .attr("transform", "translate(0, 30)");      

$("#g_textosTotales").css({top: 910, left: padding, position:'absolute'});
$("#g_alimentacionTrends").css({top: 913, left: (padding * 2) + 400, position:'absolute'});
    
    
function cargarTendencias(){ 
    
    var nameTrend = window.location.search.substr(1).split('=')[1];
    var variablesFiltroAux = leerCookieTendencias(nameTrend);
    if(variablesFiltroAux!=null)
        variablesFiltroTendencias = variablesFiltroAux;

    cargarGraficasTiempoTendencias();

    var variablesMatchTrends = variablesFiltroTendencias.filters;

    for(var i = 0; i < variablesMatchTrends.length; i++){
        if(variablesMatchTrends[i].nameVariable == "sexo"){
           variablesMatchTrends[i].valuesFilters = [variablesFiltroTendencias.gender];
           break;
        }
    }
    variablesFiltroTendencias.filters = variablesMatchTrends;

    document.cookie = nameTrend + "=" + JSON.stringify(variablesFiltroTendencias);
    var tipoMedida = nameTrend.substring(0, nameTrend.length - 1);
    var labelGenero = nameTrend.substring(nameTrend.length - 1, nameTrend.length);
    if(labelGenero == "1")
        labelGenero = "Niños"
    else
        labelGenero = "Niñas"

    textTitle.text("Tendencias crecimiento " + tipoMedida + " " + labelGenero)    

    $( "#divVariablesFilter" ).html(showVariablesDivFilter());

    var nodesAlimentacion = [
                                {id:"sem40_1"},{id:"sem40_2"},{id:"sem40_3"},{id:"sem40_v"},
                                {id:"mes3_1"},{id:"mes3_2"},{id:"mes3_3"},{id:"mes3_v"},
                                {id:"mes6_1"},{id:"mes6_2"},{id:"mes6_3"},{id:"mes6_v"},
                                {id:"mes9_1"},{id:"mes9_2"},{id:"mes9_3"},{id:"mes9_v"},
                                {id:"mes12_1"},{id:"mes12_2"},{id:"mes12_3"},{id:"mes12_v"}
                        ];
    var labelsYAli=["LME", "LM+LA", "LAE", "Vacios"]; 
    
    d3.select("#g_tiempo").attr("class","background_none");
    $.post("TrendsServlet", JSON.stringify(variablesFiltroTendencias), function(data){

        var groupGraph = d3.select("#parallelCoordinates")
        graphTrends = d3.chart.parallelCoordinates();
        graphTrends.data(data);
        graphTrends.measure(variablesFiltroTendencias.measure);    
        graphTrends(groupGraph);
        
        window.setTimeout(function(){

            var dataMedidas = data.listaMedidas;
            
            groupAliTendencias = d3.select("#aliTendenciasSelect")

            graphTrendsAli = d3.chart.gridCircle();
            var dataAlimentacion = graphTrendsAli.countTrends(dataMedidas,'alimentacion');
            graphTrendsAli.nodes(nodesAlimentacion);
            graphTrendsAli.labelsY(labelsYAli);
            graphTrendsAli.data(dataAlimentacion);
            graphTrendsAli(groupAliTendencias);

            graphTrendsAli.on("filter", function(filtered) {
                graphTrends.dataSelected(filtered,'alimentacion');
                graphTrends.updateSelected();
                
                /*graphTrendsNut.dataSelected(filtered,'alimentacion');
                graphTrendsNut.updateSelected();*/
            });


        },100);   
       
        
        totalesTendencias(data);
        
    });
 
}
            
function countTrendsAlimentacion(dataMedidas){
    var dataAlimentacion=[];
    var dataAlimentacion1=[];
    for(var i=0;i<dataMedidas.length;i++){
        var dat1='v';
        var dat2='v';
        if(dataMedidas[i].alimentacion_sem40){
            dat1=dataMedidas[i].alimentacion_sem40;
        }
        if(dataMedidas[i].alimentacion_mes3){
            dat2=dataMedidas[i].alimentacion_mes3;
        }
        if(dataAlimentacion1['sem40_'+dat1+'mes3_'+dat2]){
            dataAlimentacion1['sem40_'+dat1+'mes3_'+dat2].weight++;
        }else{
            dataAlimentacion1['sem40_'+dat1+'mes3_'+dat2]={source:'sem40_'+dat1, target:'mes3_'+dat2,weight:1};
            dataAlimentacion.push(dataAlimentacion1['sem40_'+dat1+'mes3_'+dat2]);
        }
        dat1=dat2;
        if(dataMedidas[i].alimentacion_mes6){
            dat2=dataMedidas[i].alimentacion_mes6;
        }
        if(dataAlimentacion1['mes3_'+dat1+'mes6_'+dat2]){
            dataAlimentacion1['mes3_'+dat1+'mes6_'+dat2].weight++;
        }else{
            dataAlimentacion1['mes3_'+dat1+'mes6_'+dat2]={source:'mes3_'+dat1, target:'mes6_'+dat2,weight:1};
            dataAlimentacion.push(dataAlimentacion1['mes3_'+dat1+'mes6_'+dat2]);
        }
        dat1=dat2;
        if(dataMedidas[i].alimentacion_mes9){
            dat2=dataMedidas[i].alimentacion_mes9;
        }
        if(dataAlimentacion1['mes6_'+dat1+'mes9_'+dat2]){
            dataAlimentacion1['mes6_'+dat1+'mes9_'+dat2].weight++;
        }else{
            dataAlimentacion1['mes6_'+dat1+'mes9_'+dat2]={source:'mes6_'+dat1, target:'mes9_'+dat2,weight:1};
            dataAlimentacion.push(dataAlimentacion1['mes6_'+dat1+'mes9_'+dat2]);
        }
        dat1=dat2;
        if(dataMedidas[i].alimentacion_mes12){
            dat2=dataMedidas[i].alimentacion_mes12;
        }
        if(dataAlimentacion1['mes9_'+dat1+'mes12_'+dat2]){
            dataAlimentacion1['mes9_'+dat1+'mes12_'+dat2].weight++;
        }else{
            dataAlimentacion1['mes9_'+dat1+'mes12_'+dat2]={source:'mes9_'+dat1, target:'mes12_'+dat2,weight:1};
            dataAlimentacion.push(dataAlimentacion1['mes9_'+dat1+'mes12_'+dat2]);
        }
    }

    return dataAlimentacion;
}

function updateDataParallelCordinates(){

    var serviceTrends = "TrendsServlet";
    if(graphNormalized)
        serviceTrends = "TrendsNormalizedServlet";
        
    d3.select("#g_tiempo").attr("class","background_cargando");
    $.post(serviceTrends, JSON.stringify(variablesFiltroTendencias), function(data){

        d3.select("#g_tiempo").attr("class","background_none");
        graphTrends.data(data);
        graphTrends.measure(variablesFiltroTendencias.measure);
        graphTrends.update()

        var dataMedidas = data.listaMedidas;
        var dataAlimentacion = countTrendsAlimentacion(dataMedidas);

        graphTrendsAli.data(dataAlimentacion);
        graphTrendsAli.update();
        totalesTendencias(data);
    });
}

function totalesTendencias(data){
    d3.select('#totalRegistros').text("Total registros: " + data.cantidadRegistros.toString());
    d3.select('#totalTrends').text("Tendencias: " + data.listaMedidas.length); 
    d3.select('#totalError').text("Error: " + data.cantidadErrores.toString()); 
    d3.select('#totalOutlier').text("Outlier: " + data.cantidadOutliers.toString()); 

    d3.select('#totalSelect').text("Selección: " + d3.selectAll(".seleccionado")[0].length); 
}

function updateData(){

    buttonsyear.filtered(existeFiltro("ANOCAT"));
    buttonsyear.marckFiltered(); 
    updateDataParallelCordinates();
}
         
function existeFiltro(nombreVariable){
    
    var indexFiltro = $.grep(variablesFiltroTendencias.filters, function(e){ return e.nameVariable == nombreVariable; });
    if (indexFiltro.length != 0) 
        return true;
    else
        return false;
    
}         
         
function showVariablesDivFilter(){

    var detalleFiltros = variablesFiltroTendencias.filters;

    var cadCompleta = '';
    for(var i = 0; i < detalleFiltros.length; i++){
        //cadVariables += '<span class="list-group-item">' + detalleFiltros[i].labelVariable + ' <span style="color:#5D6D7E">(';
        var variable = '<span class="list-group-item">' + detalleFiltros[i].labelVariable + ' <span style="color:#5D6D7E">(';
        var valores = '';
        
        if( detalleFiltros[i].nameVariable.includes("CD6"))
            variable = '<span class="list-group-item">Coef. Intelectual 6 y 12 meses <span style="color:#5D6D7E">(';
        
        if( detalleFiltros[i].nameVariable.includes("CD12"))
            continue;
        
        if(detalleFiltros[i].valuesLabels != undefined)
            for(var j = 0 ; j < + detalleFiltros[i].valuesLabels.length; j++){
                valores += detalleFiltros[i].valuesLabels[j] + ", ";
            }        
        else
            for(var j = 0 ; j < + detalleFiltros[i].valuesFilters.length; j++){
                valores += detalleFiltros[i].valuesFilters[j].toString() + ", ";
            } 

        cadCompleta += variable.concat(valores, ') </span>');
        cadCompleta = cadCompleta.replace(', )',')');
        
        if(detalleFiltros[i].nameVariable == "ANOCAT" || detalleFiltros[i].nameVariable.includes("alimentacion"))
            cadCompleta += '<a href="javascript:eliminarVariablesFiltro(\'' + detalleFiltros[i].nameVariable + '\')"><i class="fa fa-remove pull-right"></i></a>';

        cadCompleta += '</span>';
    }

    return cadCompleta;
}

function eliminarVariablesFiltro(nameVariable){
    
    var resultVariable = $.grep(variablesFiltroTendencias.filters, function(e){ return e.nameVariable == nameVariable; });
    var i = variablesFiltroTendencias.filters.indexOf(resultVariable[0]);
    
    if(i != -1)
        variablesFiltroTendencias.filters.splice(i, 1);
    
  
    $( "#divVariablesFilter" ).html(showVariablesDivFilter());
    
    updateData();
  }
            
function updateVariablesMatch(varMatch){


    var variablesMatchTrends = variablesFiltroTendencias.filters;

    var resultVariable = $.grep(variablesMatchTrends, function(e){ return e.nameVariable == varMatch.nameVariable; });
    var i = variablesMatchTrends.indexOf(resultVariable[0]);
    
    if(i != -1)
        variablesMatchTrends.splice(i, 1);
    
    variablesMatchTrends.push(varMatch);
   
    $( "#divVariablesFilter" ).html(showVariablesDivFilter());

    updateData();
}

function leerCookieTendencias(name) {
   
    var result = document.cookie.match(new RegExp(name + '=([^;]+)'));
    result && (result = JSON.parse(result[1]));
    return result;
}

function cargarGraficasTiempoTendencias(){
    
    var tamXGraph_tiempo = resolucionWidth-(padding*2);
        
    var svgTiempo = d3.select("#g_tiempo")
        .attr("width", tamXGraph_tiempo)
        .attr("transform", "translate(0,5)");

    svgTiempo.append("text")
        .attr("id","totalFilter")
        .attr("transform", "translate(" + padding + ",25)")
        .attr("dy","0.9em")
        .style("font-size", "18px")
        .attr("fill","darkOrange");

    var g_buttonsyear = svgTiempo.append("g")
        .attr("id","anocat")
        .attr("transform", "translate(5,2)");
    
    
    $.post("FilterServlet", JSON.stringify({variablesGroup:"tiempo",variablesFiltro:null}), function(data){
        tamXGraph_resumen = (resolucionWidth - (padding*2))/3;
        
        //Años
        var data_buttonsyear = [];
        for(var i=0; i<data[0].categories.length; i++){
            var año = data[0].categories[i];
            data_buttonsyear.push({'label':año.variable, 'labelCorto':año.variable.substring(2,4), 'variable':año.variable, 'color': "#8c564b", 'value':parseInt(año.variable)});
        }
                
        buttonsyear = d3.chart.buttonBrush();
        buttonsyear.data(data_buttonsyear);
        buttonsyear.width(tamXGraph_tiempo);
        buttonsyear.height(25);
        buttonsyear.nameVariable("ANOCAT");
        buttonsyear.labelVariable("Año Nacimiento");
        buttonsyear.filtered(false);
        buttonsyear(g_buttonsyear);
    });
}

    
function showDivVariables() {
    var x = document.getElementById('divVariables');
    if (x.style.display === 'none') {
        x.style.display = 'block';
    } else {
        x.style.display = 'none';
    }
}
  