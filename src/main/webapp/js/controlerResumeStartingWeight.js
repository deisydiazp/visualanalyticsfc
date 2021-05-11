/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

var graphAlimentacion;
var lstGraphStartingWeigth = [];

var resolucionWidth = screen.width;
var padding = 70;
var widthSvg = resolucionWidth - (padding*2);
var variablesFiltro;
var heigthGraphResume = 800;



var svgTitulo = d3.select("body").append("svg")
    .attr("id","g_titulo")
    .attr("width", widthSvg)
    .attr("height", 100);

svgTitulo.append("g").append("text")
    .attr("class","title_section")
    .attr("x",0)
    .attr("y",40)
    .attr("dy","1em")
    .text("Comparación peso: al nacer, a la entrada al PMC y a la semana 40")


var svgResumenPesoInicial = d3.select("body").append("svg")
    .attr("id","g_resumenPesoInicial")
    .attr("width", widthSvg)
    .attr("height", 800);

svgResumenPesoInicial.append("g")
    .attr("id", "resumenInicial")
    .attr("transform", "translate(0, 70)");
    
 
$("#g_titulo").css({top: 0, left: padding, position:'absolute'});
$("#g_resumenPesoInicial").css({top: 100, left: padding, position:'absolute'});

function leerCookie(name) {
    if(variablesFiltro) 
        return variablesFiltro;

    var result = document.cookie.match(new RegExp(name + '=([^;]+)'));
    result && (result = JSON.parse(result[1]));
    return result;
}

function cargarControles(){
    
    svgControles = d3.select("#g_controles")
        .attr("width", resolucionWidth)
        .attr("height", "90px")
    
    svgControles
            .append("g")
            .attr("id","g_gif")
            .append("image")
            .attr("x",20)
            .attr("y",30) 
            .attr("height","40px") 
            .attr("width","40px") 
            .attr("xlink:href","images/cargando.gif");  
    
    svgControles.append("text")
        .attr("x", padding)
        .attr("y", "15")
        .text("Edad gestacional");

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
        .attr("x",resolucionWidth - (padding*2))
        .attr("y",10) 
        .attr("xlink:href","images/btnGraficar.jpg")
        .attr("width","97px")
        .attr("height","80px");  
    
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
            
            var varAños = {
                        labelVariable:"Año Nacimiento",
                        nameVariable:"ANOCAT",
                        valuesFilters:años,
                        valuesLabels:años,
                        typeFilter:"or"
                    }
            var varEdad = {
                        labelVariable:"Edad gestacional",
                        nameVariable:"edadgestacional",
                        valuesFilters:semanas,
                        valuesLabels:semanas,
                        typeFilter:"or"
                    }

            
            cargarTendenciasPeso(varAños, varEdad);
        }
     });
    
    $("#g_controles").css({left: 0, position:'absolute'});  
    
    cargarEdades();
    cargarAños();
}

function cargarEdades(){
    
    var btnEdad =   [	
        {label:"sem24", color: "#8c564b", value:'24', selected:true},
        {label:"sem25", color: "#8c564b", value:'25', selected:true},
        {label:"sem26", color: "#8c564b", value:'26', selected:true},
        {label:"sem27", color: "#8c564b", value:'27', selected:true},
        {label:"sem28", color: "#8c564b", value:'28', selected:true},
        {label:"sem29", color: "#8c564b", value:'29', selected:true},
        {label:"sem30", color: "#8c564b", value:'30', selected:true},
        {label:"sem31", color: "#8c564b", value:'31', selected:true},
        {label:"sem32", color: "#8c564b", value:'32', selected:true},
        {label:"sem33", color: "#8c564b", value:'33', selected:true},
        {label:"sem34", color: "#8c564b", value:'34', selected:true},
        {label:"sem35", color: "#8c564b", value:'35', selected:true},
        {label:"sem36", color: "#8c564b", value:'36', selected:true},
        {label:"sem37", color: "#8c564b", value:'37', selected:true},
        {label:"sem38", color: "#8c564b", value:'38', selected:true},
        {label:"sem39", color: "#8c564b", value:'39', selected:true},
        {label:"sem40", color: "#8c564b", value:'40', selected:true},
    ]

    var groupbtnEdad = d3.select("#botonesEdad");
    var widthBtn =  (resolucionWidth - (padding*2) - 100)/btnEdad.length;

    graphBtnEdad = d3.chart.buttonClickBasic();
    graphBtnEdad.height(20);
    graphBtnEdad.width(widthBtn);
    graphBtnEdad.nameVariable("edad");
    graphBtnEdad.data(btnEdad);
    graphBtnEdad(groupbtnEdad);

    svgControles.append("text")
        .text("Todos")
        .attr("x",resolucionWidth - (padding*2) - 65)
        .attr("y",15);

    var gCheckEdad = svgControles.append("g") 

    var checkBox = d3.chart.checkBox();
    checkBox.x(resolucionWidth - (padding*2) - 80);
    checkBox.y(5);
    checkBox.boxStrokeWidth(1);
    checkBox.size(10);
    checkBox(gCheckEdad)
    checkBox.clickEvent(function(checked) {
            graphBtnEdad.highlight(checked)
        });

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

        var widthBtn =  (resolucionWidth - (padding*2) -100)/btnYear.length;

        graphBtnYear = d3.chart.buttonClickBasic();
        graphBtnYear.height(20);
        graphBtnYear.width(widthBtn);
        graphBtnYear.nameVariable("year");
        graphBtnYear.data(btnYear);
        graphBtnYear(groupbtnYear);

        svgControles.append("text")
            .text("Todos")
            .attr("x",resolucionWidth - (padding*2) - 65)
            .attr("y",55);

        var gCheckAños = svgControles.append("g") 

        var checkBox = d3.chart.checkBox();
        checkBox.x(resolucionWidth - (padding*2) - 80);
        checkBox.y(45);
        checkBox.boxStrokeWidth(1);
        checkBox.size(10);
        checkBox(gCheckAños)
        checkBox.clickEvent(function(checked) {
            graphBtnYear.highlight(checked)
        });
    });
}

function cargarResumenPesoInicial(){

    cargarControles();

    var nameResume = window.location.search.substr(1).split('=')[1];
    variablesFiltro = leerCookie(nameResume);
   
    d3.select("#g_controles").attr("class","background_none");
    $.post("ConsultaPesoEntrada?resumen", JSON.stringify(variablesFiltro.filters), function(data){
        
        var groupPeso = d3.select("#resumenInicial");

        svgResumenPesoInicial.append("text")
            .text("Resumen - promedio por año")
            .attr("x",0)
            .attr("y",10)
            .style("font-size", "14px")
            .attr("fill", "#888");


        var dimensionsEdad = {'pesoNacer':0,'pesoEntrada':1,'pesoSem40':2};
        var minimo = min(data);
        var maximo = max(data);
        
        if(maximo < 0)
            maximo = 0;
        
        var graphResumen = d3.chart.parallelBasic();
        graphResumen.dimensionesX(dimensionsEdad);
        graphResumen.nameVariable("pesoInicial");
        graphResumen.width(widthSvg);
        graphResumen.height(600);
        graphResumen.min(minimo);
        graphResumen.max(maximo);
        graphResumen.data(data);
        graphResumen(groupPeso);    
        
     });    
}

function min(data){
    var minimo=999;
    for(var i=0;i<data.length;i++){
        if(data[i].lstProm.pesoEntrada && data[i].lstProm.pesoEntrada<minimo){
            minimo=data[i].lstProm.pesoEntrada;
        }
        if(data[i].lstProm.pesoSem40 && data[i].lstProm.pesoSem40<minimo){
            minimo=data[i].lstProm.pesoSem40;
        }
        if(data[i].lstProm.pesoNacer && data[i].lstProm.pesoNacer<minimo){
            minimo=data[i].lstProm.pesoNacer;
        }
    }
    return minimo;
};

function max(data){
    var maximo=-999;
    for(var i=0;i<data.length;i++){
        if(data[i].lstProm.pesoEntrada && data[i].lstProm.pesoEntrada>maximo){
            maximo=data[i].lstProm.pesoEntrada;
        }
        if(data[i].lstProm.pesoSem40 && data[i].lstProm.pesoSem40>maximo){
            maximo=data[i].lstProm.pesoSem40;
        }
        if(data[i].lstProm.pesoNacer && data[i].lstProm.pesoNacer>maximo){
            maximo=data[i].lstProm.pesoNacer;
        }
    }
    return maximo;
};

function cargarTendenciasPeso(años, semanas){

    //----------------------------------------------------------/
   // var nameTrend = window.location.search.substr(1).split('=')[1];
    var variablesFiltroAux = variablesFiltro;//leerCookie(nameTrend);
    var detalleFiltro = variablesFiltroAux.filters;
    
    //se agrega o elimina el filtro
    var resultVariable = $.grep(detalleFiltro, function(e){ return e.nameVariable == años.nameVariable; });
    var index = detalleFiltro.indexOf(resultVariable[0]);

    if(index != -1) 
        detalleFiltro.splice(index, 1);
    
    detalleFiltro.push(años);

    resultVariable = $.grep(detalleFiltro, function(e){ return e.nameVariable == semanas.nameVariable; });
    index = detalleFiltro.indexOf(resultVariable[0]);

    if(index != -1) 
        detalleFiltro.splice(index, 1);
    
    detalleFiltro.push(semanas);  
    //----------------------------------------------------------/
  
    d3.select("#g_controles").attr("class","background_cargando");
    $.post("ConsultaPesoEntrada", JSON.stringify(detalleFiltro), function(data){
        
        d3.select("#g_controles").attr("class","background_none");
        var idGraph = lstGraphStartingWeigth.length;
        
        var svgTrendsStartingWeigth = d3.select("body").append("svg")
            .attr("id", "svgGroup_"+idGraph)
            .attr("width", widthSvg)
            .attr("height", 800);
      
        var dimensionsEdad = {'pesoNacer':0,'pesoEntrada':1,'pesoSem40':2};
        
        
        var cadAños = "Año de nacimiento: ";
        años.valuesFilters.forEach(function(año){
            cadAños = cadAños + año + ",";
        });
        
        var cadSemanas = "Semana gestacional: ";
        semanas.valuesFilters.forEach(function(semana){
            cadSemanas = cadSemanas + semana + ",";
        });
        
        var posX = 50;
        var cadCompleta = "Selección " + (idGraph + 1);
        var textCompleto = svgTrendsStartingWeigth.append("text")
            .text(cadCompleta)
            .attr("x",0)
            .attr("y",20)
            .style("font-size", "14px")
            .attr("fill", "#888");
       
        if(años.valuesFilters.length > 0){
            textCompleto.append("tspan")
                .text(cadAños)
                .attr("x",0)
                .attr("y",posX);
        
            posX = 70;    
        }
           
        if(semanas.valuesFilters.length > 0){
            textCompleto.append("tspan")
                .text(cadSemanas)
                .attr("x",0)
                .attr("y",posX)
        }
        
        $("#svgGroup_"+idGraph).css({top: (heigthGraphResume * idGraph) + 850, left: padding, position:'absolute'});
        
        var groupTrends = svgTrendsStartingWeigth.append("g").attr("id","groupTrends_"+idGraph)
            .attr("transform", "translate(0, 120)");

        graphTrend = d3.chart.parallelBasic();
        graphTrend.dimensionesX(dimensionsEdad);
        graphTrend.nameVariable("pesoInicial_"+idGraph);
        graphTrend.width(widthSvg);
        graphTrend.height(600);
        graphTrend.min(min(data));
        graphTrend.max(max(data));
        graphTrend.data(data);
        graphTrend(groupTrends);  
        
        lstGraphStartingWeigth.push(graphTrend);

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
    
    ventanaAyuda = window.open('helpResumeMeasure.html','_blank','width=1000,height=600,scrollbars=YES');
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