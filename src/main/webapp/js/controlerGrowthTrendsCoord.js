/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

var graphFenton;
var graphOMS;
var resolucionWidth = screen.width;
var variablesFilter;
var padding = 20;
var svgControles;

var svgTendencias = d3.select("body").append("svg")
    .attr("id","cartesianCoordinates")
    .attr("transform", "translate(0,0)")
    .attr("width", resolucionWidth)
    .attr("height", 1500);

var textTitle = svgTendencias.append("g").append("text")
    .attr("class","title_section")
    .attr("x",padding)
    .attr("y",20)
    .attr("dy","1em");

    
function read_cookie(name) {
    if(variablesFilter) 
        return variablesFilter;

    var result = document.cookie.match(new RegExp(name + '=([^;]+)'));
    result && (result = JSON.parse(result[1]));
    return result;
}

function cargarControles(){
    
    svgControles = d3.select("#g_controles")
        .attr("width", resolucionWidth)// 160 es el width de los botones de guardar y abrir
        .attr("height", "90px")
    
    svgControles.append("text")
        .attr("x", padding)
        .attr("y", "35")
        .text("Año nacimiento");

    svgControles.append("g")
        .attr("id", "botonesYears")
        .attr("transform", "translate(" + padding + " ,40)"); 

    var btnGraficar = svgControles.append("image")
        .attr("x",resolucionWidth - (padding*2) - 100 )
        .attr("y",10) 
        .attr("xlink:href","images/btnGraficar.jpg")
        .attr("width","73px")
        .attr("height","60px");  
      
    btnGraficar.on("click", function(){
        
        var btnSelected  = d3.selectAll("g[selected='true']") ;
        var años = [];
        btnSelected[0].forEach(function(d){
            
            if(d3.select(d).attr('btn_year') != null)
                años.push(d3.select(d).attr('btn_year'));

        });
       
        if(años.length > 0){
            var varMatch = {
                 labelVariable:"Año Nacimiento",
                 nameVariable:"ANOCAT",
                 valuesFilters:años,
                 valuesLabels:años,
                 typeFilter:"or"
             }

             updateVariablesMatch(varMatch,true);
        }else{
            
            $('#divMensaje').show();
        }     
       
    });
    
    $("#g_controles").css({left: padding, position:'absolute'});  
    cargarAños();
}

function cargarAños(){
        
    var btnYear = [];
    $.post("FilterServlet", JSON.stringify({variablesGroup:"tiempo",variablesMatch:null}), function(data){
        //Años
        for(var i=0; i<data[0].categories.length; i++){
            var año = data[0].categories[i];
            btnYear.push({'label':año.variable.substring(2,4), 'color': "#8c564b", 'value':año.variable, 'selected':true});
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
            .attr("y",35);

        var gCheckAños = svgControles.append("g") 

        var checkBox = d3.chart.checkBox();
        checkBox.x(resolucionWidth - (padding*2) - 200);
        checkBox.y(25);
        checkBox.boxStrokeWidth(1);
        checkBox.size(10);
        checkBox(gCheckAños)
        checkBox.clickEvent(function(checked) {
            graphBtnYear.highlight(checked)
        });
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
            
function cargarTendencias(){ 

    cargarControles();
    
    var nameTrend = window.location.search.substr(1).split('=')[1];
    variablesFilter = read_cookie(nameTrend);

    var variablesMatchTrends = variablesFilter.filters;

    for(var i = 0; i < variablesMatchTrends.length; i++){
        if(variablesMatchTrends[i].nameVariable == "sexo"){
           variablesMatchTrends[i].valuesFilters = [variablesFilter.gender];
           break;
        }
    }
    variablesFilter.filters = variablesMatchTrends;

    document.cookie = nameTrend + "=" + JSON.stringify(variablesFilter);
    var tipoMedida = nameTrend.substring(0, nameTrend.length - 1);
    var labelGenero = nameTrend.substring(nameTrend.length - 1, nameTrend.length);
    if(labelGenero == "1")
        labelGenero = "Niños"
    else
        labelGenero = "Niñas"

    textTitle.text("Tendencias crecimiento " + tipoMedida + " " + labelGenero)    

    $( "#divVariablesFilter" ).html(showVariablesDivFilter());

                

    $.post("TrendsServlet", JSON.stringify(variablesFilter), function(data){

        var labelsX =   [
                            "sem24", "sem25", "sem26", "sem27", "sem28", "sem29",
                            "sem30", "sem31", "sem32", "sem33", "sem34", "sem35", "sem36", "sem37", "sem38", "sem39", "sem40", 
                            "1", "2", "3", "4", "5", "6", "7", "8", "9", "10", 
                            "11", "12", "mes3", "14", "15", "16", "17", "18", "19", "20", 
                            "21", "22", "23", "24", "25", "mes6", "27", "28", "29", "30", 
                            "31", "32", "33", "34", "35", "36", "37", "38", "mes9", "40", 
                            "41", "42", "43", "44", "45", "46", "47", "48", "49", "50", 
                            "51", "mes12"
                        ]

        var groupFenton = svgTendencias.append("g")
        .attr("transform", "translate(0,70)");

        graphFenton = d3.chart.line();
        graphFenton.data(data);
        graphFenton.width(resolucionWidth-50);
        graphFenton.height(1350);
        graphFenton.labelsX(labelsX);
        graphFenton.minY(data.listaMedidasEstandar[0].sem24); //desviacion estandar -3
        graphFenton.maxY(data.listaMedidasEstandar[6].mes12); //desviacion estandar +3
        graphFenton.orient("left");
        graphFenton(groupFenton);
       
    });
}

function updateDataParallelCordinates(variablesFilter){

    $.post("TrendsServlet", JSON.stringify(variablesFilter), function(data){

        graphFenton.data(data);
        graphFenton.update()

        graphOMS.data(data);
        graphOMS.update()

    });
}

function showVariablesDivFilter(){

    var nameTrend = window.location.search.substr(1).split('=')[1];
    var variablesFilter = read_cookie(nameTrend);

    var variablesMatchTrends = variablesFilter.filters;

    var cadVariables = "";
    for(var i = 0; i < variablesMatchTrends.length; i++){
        cadVariables += '<span class="list-group-item">' + variablesMatchTrends[i].labelVariable + ' <span style="color:#5D6D7E">(';
        if(variablesMatchTrends[i].valuesLabels != undefined)
            for(var j = 0 ; j < + variablesMatchTrends[i].valuesLabels.length; j++){
                cadVariables += variablesMatchTrends[i].valuesLabels[j] + ", ";
            }        
        else
            for(var j = 0 ; j < + variablesMatchTrends[i].valuesFilters.length; j++){
                cadVariables += variablesMatchTrends[i].valuesFilters[j].toString() + ", ";
            } 

        cadVariables += ') </span>';
        cadVariables = cadVariables.replace(', )',')');
        if(variablesMatchTrends[i].nameVariable == "ANOCAT" || variablesMatchTrends[i].nameVariable.includes("alimentacion") || variablesMatchTrends[i].nameVariable.includes("WHO"))
            cadVariables += '<a href="javascript:removeVariableFilter(\'' + variablesMatchTrends[i].nameVariable + '\')"><i class="fa fa-remove pull-right"></i></a>';

        cadVariables += '</span>';
    }

    return cadVariables;
}
            
function removeVariableFilter(nameVariable){

    var varRemove = {
                        nameVariable:nameVariable
                    }

    updateVariablesMatch(varRemove, false);
}
            
function updateVariablesMatch(varMatch, add){

    //se lee la cookie    
    var nameTrend = window.location.search.substr(1).split('=')[1];
    var variablesFilter = read_cookie(nameTrend);
    var variablesMatchTrends = variablesFilter.filters;

    //se agrega o elimina el filtro
    var resultVariable = $.grep(variablesMatchTrends, function(e){ return e.nameVariable == varMatch.nameVariable; });
    var i = variablesMatchTrends.indexOf(resultVariable[0]);

    if(i != -1) {
        variablesMatchTrends.splice(i, 1);
    }

    if(add){
        variablesMatchTrends.push(varMatch);
    }

    //se actualiza la cookie
    variablesFilter.filters = variablesMatchTrends;
    document.cookie = nameTrend + "=" + JSON.stringify(variablesFilter);

    $( "#divVariablesFilter" ).html(showVariablesDivFilter());

    updateDataParallelCordinates(variablesFilter);
    //updateData(variablesFilter);
}

