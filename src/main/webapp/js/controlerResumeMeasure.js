/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

//http://bl.ocks.org/mbostock/4342045
var graphEdad;
var graphYear;
var graphBtnEdad;
var graphBtnYear;
var svgControles;

var dataEdad;
var dataYear;

var dimensionsEdad;
var dimensionsYear;

var labelsYear=['1993','1994','1995','1996','1997','1998','1999',
                '2000','2001','2002','2003','2004','2005','2006','2007','2008','2009','2010',
                '2011','2012','2013','2014','2015'];	

var labelsEdad=['sem24','sem25','sem26','sem27','sem28','sem29','sem30','sem31','sem32','sem33','sem34','sem35','sem36','sem37','sem38','sem39','sem40','mes3','mes6','mes9','mes12'];

var btnEdad;
var btnYear = [];

var resolucionWidth = screen.width;
var padding = 20;
var width = resolucionWidth - (padding*2);
var variablesFiltro;
var variablesFiltroAdicionales = ["ANOCAT", "Edad"]; // variables por las que se puede filtrar en esta pantalla


var svgPromedioEdad = d3.select("body").append("svg")
    .attr("id","g_promedioEdad")
    .attr("width", width)
    .attr("height", 600);

svgPromedioEdad.append("g").append("text")
    .attr("class","title_section")
    .attr("id", "tituloEdad")
    .attr("x",0)
    .attr("y",20)
    .attr("dy","1em")
    .text("Promedio en cada año por edad")
    
svgPromedioEdad.append("g")
    .attr("id", "promedioEdad")
    .attr("transform", "translate(20,80)");
    
var svgPromedioYear = d3.select("body").append("svg")
    .attr("id","g_promedioYear")
    .attr("width", width)
    .attr("height", 650);

svgPromedioYear.append("g").append("text")
    .attr("class","title_section")
    .attr("id", "tituloAño")
    .attr("x",0)
    .attr("y",20)
    .attr("dy","1em")
    .text("Promedio en cada edad por año")
    
svgPromedioYear.append("g")
    .attr("id", "promedioYear")
    .attr("transform", "translate(20,80)");


$("#g_promedioEdad").css({top: padding, left: padding, position:'absolute'});  
$("#g_promedioYear").css({top: 610, left: padding, position:'absolute'});  




function cargarControles(){
    
    svgControles = d3.select("#g_controles")
        .attr("width", resolucionWidth)// 160 es el width de los botones de guardar y abrir
        .attr("height", "90px")
    
    svgControles.append("text")
        .attr("x", padding)
        .attr("y", "15")
        .text("Edad");

    svgControles.append("g")
        .attr("id", "botonesEdad")
        .attr("transform", "translate(" + padding + ",20)");    
    
    svgControles.append("text")
        .attr("x", padding)
        .attr("y", "55")
        .text("Año nacimiento");

    svgControles.append("g")
        .attr("id", "botonesYears")
        .attr("transform", "translate(" + padding + " ,60)"); 

    var btnGraficar = svgControles.append("image")
        .attr("x",resolucionWidth - (padding*2) - 110 )
        .attr("y",10) 
        .attr("xlink:href","images/btnGraficar.jpg")
        .attr("width","97px")
        .attr("height","80px");  
    
    cargarEdades();
    cargarAños();
    
    
    btnGraficar.on("click", function(){
        
        var error = false;
        var btnSelected  = d3.selectAll("g[selected='true']") ;
        var años = [];
        var semanas = [];
        btnSelected[0].forEach(function(d){

            if(d3.select(d).attr('btn_edad') != null)
                semanas.push(d3.select(d).attr('btn_edad'));

            if(d3.select(d).attr('btn_year') != null)
                años.push(d3.select(d).attr('btn_year'));

        });
       
       if(años.length == 0){
            error=true;
            $('#lblMensaje').text(" Debe seleccionar por lo menos un año.");
            $('#divMensaje').show();
        }
        
        if(semanas.length == 0){
            error=true;
            $('#lblMensaje').text(" Debe seleccionar edad.");
            $('#divMensaje').show();
        }
        
        if(error == false){
            $('#divMensaje').hide();
            labelsEdad = semanas;
            labelsYear = años;
            var variableEdad;
            var variableAño;
            
            variableAño = {
                     labelVariable:"Año Nacimiento",
                     nameVariable:"ANOCAT",
                     valuesFilters:años,
                     valuesLabels:años,
                     typeFilter:"or"
                 }
            
            variableEdad = {
                     labelVariable:"Edad",
                     nameVariable:"Edad",
                     valuesFilters:semanas,
                     valuesLabels:semanas,
                     typeFilter:"or"
                }
            
            if(btnYear.length != labelsYear.length)
                actualizarVariablesFiltro(variableAño, true);
            else 
                actualizarVariablesFiltro(variableAño, false);
            
            
            if(btnEdad.length != labelsEdad.length)
                actualizarVariablesFiltro(variableEdad, true);
            else
                actualizarVariablesFiltro(variableEdad, false);
            
            
            actualizarGraficas();
        }
    });
    
    $("#g_controles").css({left: padding, position:'absolute'});  
    
   
}

function leerCookie(name) {
    if(variablesFiltro) 
        return variablesFiltro;

    var result = document.cookie.match(new RegExp(name + '=([^;]+)'));
    result && (result = JSON.parse(result[1]));
    return result;
}

function cargarEdades(){
    
    btnEdad =   [	
        {label:"sem24", color: "#8c564b", value:'sem24', selected:true},
        {label:"sem25", color: "#8c564b", value:'sem25', selected:true},
        {label:"sem26", color: "#8c564b", value:'sem26', selected:true},
        {label:"sem27", color: "#8c564b", value:'sem27', selected:true},
        {label:"sem28", color: "#8c564b", value:'sem28', selected:true},
        {label:"sem29", color: "#8c564b", value:'sem29', selected:true},
        {label:"sem30", color: "#8c564b", value:'sem30', selected:true},
        {label:"sem31", color: "#8c564b", value:'sem31', selected:true},
        {label:"sem32", color: "#8c564b", value:'sem32', selected:true},
        {label:"sem33", color: "#8c564b", value:'sem33', selected:true},
        {label:"sem34", color: "#8c564b", value:'sem34', selected:true},
        {label:"sem35", color: "#8c564b", value:'sem35', selected:true},
        {label:"sem36", color: "#8c564b", value:'sem36', selected:true},
        {label:"sem37", color: "#8c564b", value:'sem37', selected:true},
        {label:"sem38", color: "#8c564b", value:'sem38', selected:true},
        {label:"sem39", color: "#8c564b", value:'sem39', selected:true},
        {label:"sem40", color: "#8c564b", value:'sem40', selected:true},
        {label:"mes3", color: "#8c564b", value:'mes3', selected:true},
        {label:"mes6", color: "#8c564b", value:'mes6', selected:true},
        {label:"mes9", color: "#8c564b", value:'mes9', selected:true},
        {label:"mes12", color: "#8c564b", value:'mes12', selected:true}
    ]

    var groupbtnEdad = d3.select("#botonesEdad");
    var widthBtn =  (resolucionWidth - (padding*2) - 150)/btnEdad.length;

    graphBtnEdad = d3.chart.buttonClickBasic();
    graphBtnEdad.height(20);
    graphBtnEdad.width(widthBtn);
    graphBtnEdad.nameVariable("edad");
    graphBtnEdad.data(btnEdad);
    graphBtnEdad(groupbtnEdad);

    svgControles.append("text")
        .text("Todos")
        .attr("x",resolucionWidth - (padding*2) - 180)
        .attr("y",15);

    var gCheckEdad = svgControles.append("g") 

    var checkBox = d3.chart.checkBox();
    checkBox.x(resolucionWidth - (padding*2) - 200);
    checkBox.y(5);
    checkBox.boxStrokeWidth(1);
    checkBox.size(10);
    checkBox(gCheckEdad)
    checkBox.clickEvent(function(checked) {
            graphBtnEdad.highlight(checked)
        });

}

function cargarAños(){
       
    btnYear = [];
    
    $.post("FilterServlet", JSON.stringify({variablesGroup:"tiempo",variablesMatch:null}), function(data){
        //Años
        for(var i=0; i<data[0].categories.length; i++){
            var año = data[0].categories[i];
            btnYear.push({'label':año.variable.substring(2,4), 'color': "#8c564b", 'value':año.variable, 'selected':true});
            labelsYear.push(año.variable);
        }
        
        var groupbtnYear = d3.select("#botonesYears");

        var widthBtn =  (resolucionWidth - (padding*2) -150)/btnYear.length;

        graphBtnYear = d3.chart.buttonClickBasic();
        graphBtnYear.height(20);
        graphBtnYear.width(widthBtn);
        graphBtnYear.nameVariable("year");
        graphBtnYear.data(btnYear);
        graphBtnYear(groupbtnYear);

        svgControles.append("text")
            .text("Todos")
            .attr("x",resolucionWidth - (padding*2) - 180)
            .attr("y",55);

        var gCheckAños = svgControles.append("g") 

        var checkBox = d3.chart.checkBox();
        checkBox.x(resolucionWidth - (padding*2) - 200);
        checkBox.y(45);
        checkBox.boxStrokeWidth(1);
        checkBox.size(10);
        checkBox(gCheckAños)
        checkBox.clickEvent(function(checked) {
            graphBtnYear.highlight(checked)
        });
    });
}

function cargarResumen(){
    
    var nameResume = window.location.search.substr(1).split('=')[1];
    variablesFiltro = leerCookie(nameResume);
    
    d3.select('#tituloEdad').text('Promedio ' + variablesFiltro.measure + ' en cada año por edad');
    d3.select('#tituloAño').text('Promedio ' + variablesFiltro.measure + ' en cada edad por año');
     
    cargarControles();
    
    //primera grafica eje horizontal edad (sem24, sem25...), cada linea representa un año
    $.post("AverageMeasureServlet", JSON.stringify(variablesFiltro), function(data){
   
        dataEdad = data[0];
        dimensionsEdad = {};
   
        dataYear = data[1];
        dimensionsYear = {};
        
        var dataAuxEdad = []
        var dataAuxYear = [];
        
        dataAuxYear = dataYear;
        
        for(var i=0;i<labelsEdad.length;i++){
            dimensionsEdad[labelsEdad[i]]=i;
        }
       
        //-------------------------------------------------------------------------------------------------//
        var filtroAños = $.grep(variablesFiltro.filters, function(e){ return e.nameVariable == "ANOCAT"; });
        index = variablesFiltro.filters.indexOf(filtroAños[0]);
        
        if(index != -1) {
            
            labelsYear = filtroAños[0].valuesLabels;
            for(var i=0;i<labelsYear.length;i++){
                for(var j = 0; j < dataEdad.length; j++){
                    if(labelsYear[i] == dataEdad[j].CODE)
                        dataAuxEdad.push(dataEdad[j]);
                }
            }
            
        }else{
            dataAuxEdad = dataEdad;
        }
        
        for(var i = 0; i<labelsYear.length; i++){
            dimensionsYear[labelsYear[i]]=i;
        }
        //-----------------------------------------------------------------------------------------------//
        
        var min = 20000;
        var max = 0;
        
        for(var i = 0; i< labelsEdad.length; i++){

            var minAux = d3.min(dataAuxEdad, function(p) { if(p.lstProm[labelsEdad[i]] !=0) return +p.lstProm[labelsEdad[i]]; });
            var maxAux = d3.max(dataAuxEdad, function(p) { if(p.lstProm[labelsEdad[i]] !=0) return +p.lstProm[labelsEdad[i]]; });

            if(min > minAux)
                min = minAux

            if(max < maxAux)
                max = maxAux	
        }
       
        if(variablesFiltro.measure == "peso"){
            min = min - 100;
            max = max + 100;
        }
        
        var groupEdad = d3.select("#promedioEdad");
      
        graphEdad = d3.chart.parallelBasic();
        graphEdad.dimensionesX(dimensionsEdad);
        graphEdad.nameVariable("edad");
        graphEdad.width(resolucionWidth - (padding*3));
        graphEdad.height(500);
        graphEdad.min(min);
        graphEdad.max(max);
        graphEdad.data(dataAuxEdad);
        graphEdad(groupEdad);
        
        var groupYear = d3.select("#promedioYear");
       
        graphYear = d3.chart.parallelBasic();
        graphYear.dimensionesX(dimensionsYear);
        graphYear.nameVariable("year");
        graphYear.width(resolucionWidth - (padding*3));
        graphYear.height(500);
        graphYear.min(min);
        graphYear.max(max);
        graphYear.data(dataAuxYear);
        graphYear(groupYear);
        
     });
			
}

function actualizarGraficas(){
				
    var dataAuxEdad = [];
    var dataAuxYear = [];
    
    dimensionsEdad = {};
    dimensionsYear = {};
	
    for(var i=0;i<labelsEdad.length;i++){
        for(var j = 0; j < dataYear.length; j++){
            if(labelsEdad[i] == dataYear[j].CODE)
                dataAuxYear.push(dataYear[j]);
        }
    }

    for(var i=0;i<labelsEdad.length;i++){
        dimensionsEdad[labelsEdad[i]]=i;
    }
        
        
    //---------------------------------------//
    for(var i=0;i<labelsYear.length;i++){
        for(var j = 0; j < dataEdad.length; j++){
            if(labelsYear[i] == dataEdad[j].CODE)
                dataAuxEdad.push(dataEdad[j]);
        }
    }

    for(var i=0;i<labelsYear.length;i++){
        dimensionsYear[labelsYear[i]]=i;
    }

    var min = 20000;
    var max = 0;

    for(var i = 0; i< labelsEdad.length; i++){

        var minAux = d3.min(dataAuxEdad, function(p) { if(p.lstProm[labelsEdad[i]] !=0) return +p.lstProm[labelsEdad[i]]; });
        var maxAux = d3.max(dataAuxEdad, function(p) { if(p.lstProm[labelsEdad[i]] !=0) return +p.lstProm[labelsEdad[i]]; });

        if(min > minAux)
            min = minAux

        if(max < maxAux)
            max = maxAux	
    }

    if(variablesFiltro.measure == "peso"){
        min = min - 100;
        max = max + 100;
    }
    graphEdad.data(dataAuxEdad);
    graphEdad.min(min);
    graphEdad.max(max);
    graphEdad.dimensionesX(dimensionsEdad);
    graphEdad.update();  

    graphYear.data(dataAuxYear);
    graphYear.min(min);
    graphYear.max(max);
    graphYear.dimensionesX(dimensionsYear);
    graphYear.update();
}

function mostrarVariablesMenu() {
    
    $( "#divVariablesFilter" ).html(actualizarVariablesMenu());
    
    var x = document.getElementById('divVariables');
    if (x.style.display === 'none') {
        x.style.display = 'block';
    } else {
        x.style.display = 'none';
    }
}

function actualizarVariablesFiltro(variable, add){

    var detalleFiltro = variablesFiltro.filters;

    //se agrega o elimina el filtro
    var resultVariable = $.grep(detalleFiltro, function(e){ return e.nameVariable == variable.nameVariable; });
    var index = detalleFiltro.indexOf(resultVariable[0]);

    if(index != -1) {
        detalleFiltro.splice(index, 1);
    }

    if(add){
        detalleFiltro.push(variable);
    }

    variablesFiltro.filters = detalleFiltro;
   
}

function actualizarVariablesMenu(){
    
    var detalleFiltro = variablesFiltro.filters;
    
    var cadVariables = "";
    for(var i = 0; i < detalleFiltro.length; i++){
        cadVariables += '<span class="list-group-item">' + detalleFiltro[i].labelVariable + ' <span style="color:#5D6D7E">(';
        if(detalleFiltro[i].valuesLabels != undefined)
            for(var j = 0 ; j < + detalleFiltro[i].valuesLabels.length; j++){
                cadVariables += detalleFiltro[i].valuesLabels[j].toString() + ", ";
            } 
        
        cadVariables += ') </span>';
        cadVariables = cadVariables.replace(', )',')');
        cadVariables += '</span>';
    }
    
    return cadVariables;
}