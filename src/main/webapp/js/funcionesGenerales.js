/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

var variablesFiltro = [
    {
        labelVariable: "Género",
        nameVariable:"sexo",
        valuesFilters:[2,1],
        valuesLabels:['Niña','Niño'],
        typeFilter:"or"
    },
    {
        labelVariable:"RCIU peso Fenton",
        nameVariable:"RCIUpesoFenton",
        valuesFilters:[0,1],
        valuesLabels:['No','Si'],
        typeFilter:"or"
    }
];

var graphResumen;
var lstGraphs = [];
//$( "#divVariablesFilter" ).html(showVariablesDivFilter());


function agregarVariablesFiltro(varMatch){ //updateVariablesMatch
 
    var resultVariable = $.grep(variablesFiltro, function(e){ return e.nameVariable == varMatch.nameVariable; });
    var i = variablesFiltro.indexOf(resultVariable[0]);
    
    if(i != -1)
        variablesFiltro.splice(i, 1);
    
    variablesFiltro.push(varMatch);
   
    $( "#divVariablesFilter" ).html(showVariablesDivFilter());
 }
 
function eliminarVariablesFiltro(nameVariable){//removeVariableFilter
    var resultVariable = $.grep(variablesFiltro, function(e){ return e.nameVariable == nameVariable; });
    var i = variablesFiltro.indexOf(resultVariable[0]);
    
    if(i != -1)
        variablesFiltro.splice(i, 1);
    
    //se eliminan las variables de coeficiente intelectual
    if(nameVariable=="CD6"){
        resultVariable = $.grep(variablesFiltro, function(e){ return e.nameVariable == "CD12"; });
        i = variablesFiltro.indexOf(resultVariable[0]);
        variablesFiltro.splice(i, 1);
    }
    
    $( "#divVariablesFilter" ).html(showVariablesDivFilter());
 }
 
function showVariablesDivFilter(){
    
    var cadCompleta = '';
    for(var i = 0; i < variablesFiltro.length; i++){
        //cadVariables += '<span class="list-group-item">' + variablesFiltro[i].labelVariable + ' <span style="color:#5D6D7E">(';
        var variable = '<span class="list-group-item">' + variablesFiltro[i].labelVariable + ' <span style="color:#5D6D7E">(';
        var valores = '';
        if( variablesFiltro[i].nameVariable.includes("CD6"))
            variable = '<span class="list-group-item">Coef. Intelectual 6 y 12 meses <span style="color:#5D6D7E">(';
        
        if( variablesFiltro[i].nameVariable.includes("CD12"))
            continue;
        
        if(variablesFiltro[i].valuesLabels != undefined){
            for(var j = 0 ; j < + variablesFiltro[i].valuesLabels.length; j++){
                valores += variablesFiltro[i].valuesLabels[j] + ", ";
            }        
        }
        else{
            for(var j = 0 ; j < + variablesFiltro[i].valuesFilters.length; j++){
                valores += variablesFiltro[i].valuesFilters[j].toString() + ", ";
            } 
        }
        cadCompleta += variable.concat(valores, ') </span>');
        cadCompleta = cadCompleta.replace(', )',')');
        if(variablesFiltro[i].nameVariable != "sexo" && variablesFiltro[i].nameVariable != "RCIUpesoFenton")
            cadCompleta += '<a href="javascript:removeVariableFilter(\'' + variablesFiltro[i].nameVariable + '\')"><i class="fa fa-remove pull-right"></i></a>';
        
        cadCompleta += '</span>';
    }
    
    return cadCompleta;
}

function leerCookie(name) {
  
    var result = document.cookie.match(new RegExp(name + '=([^;]+)'));
    result && (result = JSON.parse(result[1]));
    return result;
}

function cargarGraficasTiempo(){
    
    var tamXGraph_tiempo = resolucionWidth-200;
        
    var svgTiempo = d3.select("#g_tiempo")
        .attr("width", tamXGraph_tiempo)
        .attr("transform", "translate(0,5)");

    svgTiempo.append("text")
        .attr("id","totalFilter")
        .attr("transform", "translate(" + (tamXGraph_tiempo-190) + ",25)")
        .attr("dy","0.9em")
        .style("font-size", "18px")
        .attr("fill","darkOrange");
    
    svgTiempo.append("i")
        //.attr("id","totalFilter")
        .attr("transform", "translate(" + (tamXGraph_tiempo-190) + ",15)")
        .attr("dy","0.9em")
        .style("font-size", "18px")
        //.attr("fill","darkOrange");
        .attr("class","fa fa-bar-chart")
        

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
                
        var buttonsyear = d3.chart.buttonBrush();
        buttonsyear.data(data_buttonsyear);
        buttonsyear.width(tamXGraph_tiempo-205);
        buttonsyear.height(25);
        buttonsyear.nameVariable("ANOCAT");
        buttonsyear.labelVariable("Año Nacimiento");
        buttonsyear.filtered(existeFiltro("ANOCAT"));
        buttonsyear(g_buttonsyear);

        var groupGraph = d3.select("#g_tiempoResumen").append("g").attr("transform","translate(0,10)");
        
        graphResumen = d3.chart.bar();
        graphResumen.width(730);
        graphResumen.height(300);
        graphResumen.labelVariable(data[0].label);
        graphResumen.nameVariable(data[0].nameVariable);
        graphResumen.filtered(existeFiltro("ANOCAT"));
        graphResumen.withBrush(true);
        graphResumen.data(data[0].categories);
        graphResumen(groupGraph);

    });
}

function actualizarGraficaTiempo(){
   
    var x = document.getElementById('divTiempo');
    
    if (x.style.display === 'none') {
        d3.select("#g_tiempoResumen").attr("class","background_cargando");
        $.post("FilterServlet", JSON.stringify({variablesGroup:"tiempo",variablesFiltro:variablesFiltro}), function(data){
            d3.select("#g_tiempoResumen").attr("class","background_none");
            x.style.display = 'block';
            graphResumen.data(data[0].categories);
            graphResumen.filtered(existeFiltro("ANOCAT"));
            graphResumen.update();

        });
        
       
    } else {
        x.style.display = 'none';
    }
}

function showVariablesDivSave(){
    
    var cadVariables = "";
    for(var i = 0; i < variablesFiltro.length; i++){
        cadVariables += '<span class="list-group-item">' + variablesFiltro[i].labelVariable + ' <span style="color:#5D6D7E">(';
        if(variablesFiltro[i].valuesLabels != undefined)
            for(var j = 0 ; j < + variablesFiltro[i].valuesLabels.length; j++){
                cadVariables += variablesFiltro[i].valuesLabels[j] + ",";
            }        
        else
            for(var j = 0 ; j < + variablesFiltro[i].valuesFilters.length; j++){
                cadVariables += variablesFiltro[i].valuesFilters[j].toString() + ",";
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
    for(var i = 0; i < variablesFiltro.length; i++){
        if(variablesFiltro[i].nameVariable != 'sexo' && variablesFiltro[i].nameVariable != 'RCIUpesoFenton'){
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
            variablesFilter : variablesFiltro
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
        
        variablesFiltro = estadoConsultaAbrir;
        $( "#divVariablesFilter" ).html(showVariablesDivFilter());
        updateData();
        
    });
    
    $('#modalOpen').modal('hide');
}

function existeFiltro(nombreVariable){
    
    var indexFiltro = $.grep(variablesFiltro, function(e){ return e.nameVariable == nombreVariable; });
    if (indexFiltro.length != 0) 
        return true;
    else
        return false;
    
}

function showDivVariables() {
    var x = document.getElementById('divVariables');
    if (x.style.display === 'none') {
        x.style.display = 'block';
    } else {
        x.style.display = 'none';
    }
}

function resumenTendCrecimiento(measure){
    var variablesFiltroAux = leerCookie("filtroGeneral");
    if(variablesFiltroAux!=null)
        variablesFiltro = variablesFiltroAux;
    
    var variablesFilter =   {
                                outlier : false,
                                gender : 0, //no se esta teniendo en cuenta el genero para los resumenes
                                measure : measure,
                                filters : variablesFiltro
                            }
    
    document.cookie = "resume_" + measure + "=" + JSON.stringify(variablesFilter);
    document.getElementById('content').src = 'resumeMeasure.html?resumeMeasure=resume_'+measure;
}

function resumenPesoInicial(){
    var variablesFiltroAux = leerCookie("filtroGeneral");
    if(variablesFiltroAux!=null)
        variablesFiltro = variablesFiltroAux;
    
    var variablesFilter =   {
                                filters : variablesFiltro
                            }
    
    document.cookie = "pesoInicial=" + JSON.stringify(variablesFilter);
    document.getElementById('content').src = 'resumeStartingWeight.html?resume=pesoInicial';
}

function resumenAlimentacion(){
    var variablesFiltroAux = leerCookie("filtroGeneral");
    if(variablesFiltroAux!=null)
        variablesFiltro = variablesFiltroAux;
    
    var variablesFilter =   {
                                filters : variablesFiltro
                            }
    
    document.cookie = "alimentacion=" + JSON.stringify(variablesFilter);
    document.getElementById('content').src = 'resumeFeeding.html?resumeFeeding=alimentacion';
}