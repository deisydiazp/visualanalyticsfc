/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

var graphAlimentacion;
var lstGraphTrends = [];

var resolucionWidth = screen.width;
var padding = 20;
var width = resolucionWidth - (padding*2);
var variablesFiltro;
var heigthGraphResume;
var svgControles;

var svgResumenAlimentacion = d3.select("body").append("svg")
    .attr("id","g_alimentacion")
    .attr("width", width);

svgResumenAlimentacion.append("g").append("text")
    .attr("class","title_section")
    .attr("x",0)
    .attr("y",20)
    .attr("dy","1em")
    .text("Alimentación por año")
    
svgResumenAlimentacion.append("g")
    .attr("id", "resumenAlimentacion")
    .attr("transform", "translate(0,80)");
    
$("#g_alimentacion").css({top: padding, left: padding, position:'absolute'});

function leerCookie(name) {
    if(variablesFiltro) 
        return variablesFiltro;

    var result = document.cookie.match(new RegExp(name + '=([^;]+)'));
    result && (result = JSON.parse(result[1]));
    return result;
}

function cargarControles(){
    
    svgControles = d3.select("#g_controles")
        .attr("width", resolucionWidth)// 160 es el width de los botones de guardar y abrir
        .attr("height", "90px")

     svgControles
            .append("g")
            .attr("id","g_gif")
            .append("image")
            .attr("x",20)
            .attr("y",20) 
            .attr("height","40px") 
            .attr("width","40px") 
            .attr("xlink:href","images/cargando.gif");  
    
    svgControles.append("text")
        .attr("x", padding + 50)
        .attr("y", "35")
        .text("Año nacimiento");

    svgControles.append("g")
        .attr("id", "botonesYears")
        .attr("transform", "translate(" + (padding + 50) + " ,40)"); 

    var btnGraficar = svgControles.append("image")
        .attr("x",resolucionWidth - (padding*2) - 70 )
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
            var varAños = {
                labelVariable:"Año Nacimiento",
                nameVariable:"ANOCAT",
                valuesFilters:años,
                valuesLabels:años,
                typeFilter:"or"
            }

            cargarTendenciasAlimentacion(varAños);
         }else{
            $('#divMensaje').show();
        } 
       
    });
    
    $("#g_controles").css({left: 0, position:'absolute'});  
    
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
            .attr("x",resolucionWidth - (padding*2) - 110)
            .attr("y",35);

        var gCheckAños = svgControles.append("g") 

        var checkBox = d3.chart.checkBox();
        checkBox.x(resolucionWidth - (padding*2) - 130);
        checkBox.y(25);
        checkBox.boxStrokeWidth(1);
        checkBox.size(10);
        checkBox(gCheckAños)
        checkBox.clickEvent(function(checked) {
            graphBtnYear.highlight(checked)
        });
    });
}

function cargarResumenAlimentacion(){

    cargarControles();
    
    var nameResume = window.location.search.substr(1).split('=')[1];
    variablesFiltro = leerCookie(nameResume);
   
    d3.select("#g_controles").attr("class","background_none");
    $.post("ResumeFeedingServlet", JSON.stringify(variablesFiltro.filters), function(data){
        
        heigthGraphResume = (data.length*30) + 200;
        
        d3.select("#g_alimentacion")
            .attr("height", heigthGraphResume);

        var groupAli = d3.select("#resumenAlimentacion");

        graphAlimentacion = d3.chart.barHorizontalFeeding();
        graphAlimentacion.height(25);
        graphAlimentacion.width(width);
        graphAlimentacion.data(data);
        graphAlimentacion(groupAli);    
        
     });    
}

function cargarTendenciasAlimentacion(años){
    
    var variablesFiltroAux = variablesFiltro;//leerCookie(nameTrend);
    var detalleFiltro = variablesFiltroAux.filters;
    
    //se agrega o elimina el filtro
    var resultVariable = $.grep(detalleFiltro, function(e){ return e.nameVariable == años.nameVariable; });
    var index = detalleFiltro.indexOf(resultVariable[0]);

    if(index != -1) 
        detalleFiltro.splice(index, 1);
    
    detalleFiltro.push(años);

    d3.select("#g_controles").attr("class","background_cargando");
    $.post("ResumeTrendsFeedingServlet", JSON.stringify(detalleFiltro), function(data){
        
        d3.select("#g_controles").attr("class","background_none");
        var idGraph = lstGraphTrends.length;
        
        var svgTrendsAlimentacion = d3.select("body").append("svg")
            .attr("id", "svgGroup_"+idGraph)
            .attr("width", width)
            .attr("height", 500);
        
        
        var textYears = svgTrendsAlimentacion.append("text");
    
        var cadYears = "";
        var i = 0;
        var j = 0;
        años.valuesFilters.forEach(function(year){
            cadYears = cadYears + year + ",";
            if(i == 10){
                textYears.append("tspan")
                    .text(cadYears)
                    .attr("x",950)
                    .attr("y",50+(20*j))
                    .style("font-size", "14px")
                    .attr("fill", "#888");
                i=0;
                cadYears = "";
                j++;
            }
            i++;
        });
        
        if(i!=0){
            textYears.append("tspan")
                    .text(cadYears)
                    .attr("x",950)
                    .attr("y",50+(20*j))
                    .style("font-size", "14px")
                    .attr("fill", "#888");
        }
       
        var nodesAlimentacion = [
                                {id:"sem40_1"},{id:"sem40_2"},{id:"sem40_3"},{id:"sem40_v"},
                                {id:"mes3_1"},{id:"mes3_2"},{id:"mes3_3"},{id:"mes3_v"},
                                {id:"mes6_1"},{id:"mes6_2"},{id:"mes6_3"},{id:"mes6_v"},
                                {id:"mes9_1"},{id:"mes9_2"},{id:"mes9_3"},{id:"mes9_v"},
                                {id:"mes12_1"},{id:"mes12_2"},{id:"mes12_3"},{id:"mes12_v"}
                        ];
        
        var labelsYAli=["LME", "LM+LA", "LAE", "Vacios"]; 
        
        $("#svgGroup_"+idGraph).css({top: heigthGraphResume + (430 * idGraph), left: padding, position:'absolute'});
        
        var groupAliTendencias = svgTrendsAlimentacion.append("g").attr("id","groupTrends_"+idGraph);

            var graphTrendsAli = d3.chart.gridCircle();
            graphTrendsAli.nodes(nodesAlimentacion);
            graphTrendsAli.labelsY(labelsYAli);
            graphTrendsAli.data(data);
            graphTrendsAli(groupAliTendencias);
        
        lstGraphTrends.push(graphTrendsAli);
        
     });

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

function mostrarVentanaAyuda() {
    
    ventanaAyuda = window.open('helpResumeFeeding.html','_blank','width=1000,height=600,scrollbars=YES');
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