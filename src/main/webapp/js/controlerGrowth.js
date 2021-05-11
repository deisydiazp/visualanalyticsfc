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
var graphResumen;

//var lstGraphs = [];
var lstGraphsNutricion = [];
var sankey;
var barGroup;

/*******************Entorno*************************/
tamXGraph = (resolucionWidth - (padding*4))/cantGraphsEntorno;

var svgCrecimiento = d3.select("#gbody").append("svg")
    .attr("id","g_crecimiento")
    .attr("width", resolucionWidth - (padding*2))
    .attr("height", 900);

svgCrecimiento.append("g")
    .append("text")
    .attr("class","title_section")
    .attr("x",0)
    .attr("y",0)
    .attr("dy","1em")
    .text("Características crecimiento")

svgCrecimiento.append("g")
    .attr("id","muerteprimerano")
    .attr("class","variableFilter")
    .attr("transform", "translate(" + ((padding*2) + (tamXGraph*2)) + ", 50)");    
    
svgCrecimiento.append("g")
    .attr("id","trimestre")
    .attr("class","variableFilter")
    .attr("transform", "translate(" + ((padding*2) + (tamXGraph*2)) + ", 180)");    
    
svgCrecimiento.append("g")
    .attr("id","oxigenoentrada")
    .attr("class","variableFilter")
    .attr("transform", "translate(" + ((padding*2) + (tamXGraph*2)) + ", 310)");   

svgCrecimiento.append("g")
    .attr("id","audiometria")
    .attr("class","variableFilter")
    .attr("transform", "translate(" + ((padding*2) + (tamXGraph*2)) + ", 440)");      

svgCrecimiento.append("g")
    .attr("width", tamXGraph*2+padding)
    .attr("height", 400)
    .attr("transform", "translate(10,110)")
    .attr("id","neurologia");

//ojos
svgCrecimiento.append("g")
    .attr("width", tamXGraph)
    .attr("height", 200)
    .attr("transform", "translate(10,750)")
    .attr("id","ROP");

svgCrecimiento.append("g")
    .attr("width", tamXGraph)
    .attr("height", 200)
    .attr("transform", "translate(" + (tamXGraph + padding) + ",600)")
    .attr("id","resoptometria");
    
svgCrecimiento.append("g")
    .attr("width", tamXGraph)
    .attr("height", 200)
    .attr("transform", "translate("+ (tamXGraph*2 + padding*2) +",600)")
    .attr("id","oftalmologiafinal");   

//nutricion en peso talla y pc
var svgNutricion = d3.select("#gbody").append("svg")
    .attr("id","g_nutricion")
    .attr("width", resolucionWidth - (padding*2))
    .attr("height", 400);

svgNutricion.append("g")
    .attr("width", tamXGraph)
    .attr("height", 400)
    .attr("transform", "translate(0,10)")
    .attr("id","Nutpesowho");

svgNutricion.append("g")
    .attr("width", tamXGraph)
    .attr("height", 400)
    .attr("transform", "translate(" + (tamXGraph + padding) + ",10)")
    .attr("id","Nuttallawho");

svgNutricion.append("g")
    .attr("width", tamXGraph)
    .attr("height", 400)
    .attr("transform", "translate("+ (tamXGraph*2 + padding*2) +",10)")
    .attr("id","Nutpcwho");
    
//nutricion en peso talla y pc
var svgCoeficiente = d3.select("#gbody").append("svg")
    .attr("id","g_coeficiente")
    .attr("width", resolucionWidth - (padding*2))
    .attr("height", 500);

svgCoeficiente.append("g")
    .attr("width", resolucionWidth - (padding*4))
    .attr("height", 450)
    .attr("transform", "translate(" + padding   + ",10)")
    .attr("id","CD6_CD12");    


function getDataGrowth(){
    //$("#g_resumen").css({border: '2pt solid darkOrange', background:'#f4f6f6'});
  
    lstGraphs = [];

    var variablesFiltroAux = leerCookie("filtroGeneral");
    if(variablesFiltroAux!=null)
        variablesFiltro = variablesFiltroAux;

    $( "#divVariablesFilter" ).html(showVariablesDivFilter());
    
    d3.select("#g_crecimiento").attr("class","background_none");
    d3.select("#g_nutricion").attr("class","background_none");
    d3.select("#g_coeficiente").attr("class","background_none");
    
    $.post("FilterServlet", JSON.stringify({variablesGroup:"crecimiento",variablesFiltro:variablesFiltro}), function(data){
        
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
            
        }
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
    
    $.post("FilterBarNegativeServlet", JSON.stringify({variablesGroup:"nutricion",variablesFiltro:variablesFiltro}), function(data){
            
        var min=0;
        var max=0;
        for(var i = 0; i < data.length; i++){
            for(var j = 0; j < data[i].categories.length; j++){
                
                var valor = parseInt(data[i].categories[j].value);
                if(valor>max)
                    max = valor;
                if(valor<min)
                    min = valor;
            }
        }
        
        for(var i = 0; i < data.length; i++){
            var groupGraph = d3.select("#"+data[i].nameVariable)
        
            var barNegative = d3.chart.barNegative();
            barNegative.width(tamXGraph);
            barNegative.height(200);
            barNegative.max(max);
            barNegative.min(min);
            barNegative.nameVariable(data[i].nameVariable);
            barNegative.labelVariable(data[i].label);
            barNegative.data(data[i].categories);
            barNegative(groupGraph);
            lstGraphsNutricion.push({"nameVariable":data[i].nameVariable,"graph":barNegative});
        }
        
    });
    
    $.post("FilterSankeyServlet", JSON.stringify(variablesFiltro), function(data){
        sankey = d3.chart.sankey();
        sankey.nodeWidth(40);
        sankey.nodePadding(15);
        sankey.nameVariable("neurologia");
        sankey.labelVariable("Examen neurología");
        sankey.data(data);
        sankey.size([tamXGraph*2+padding, 400]);
        sankey(d3.select("#neurologia"));
    });
    
    $.post("FilterBarGroupServlet", JSON.stringify({variablesGroup:"coeficiente",variablesFiltro:variablesFiltro}), function(data){
    
        var groupGraph = d3.select("#CD6_CD12");
            
        barGroup = d3.chart.barGroup();
        barGroup.width(resolucionWidth - (padding*4));
        barGroup.height(400);
        barGroup.nameVariable("CD6_CD12");
        barGroup.filtered(existeFiltro("CD6"));
        barGroup.labelVariable("Coeficiente intelectual");
        barGroup.data(data);
        barGroup(groupGraph);
    }); 
    
    cargarGraficasTiempo();
}

function updateData(){
    
    document.cookie = "filtroGeneral=" + JSON.stringify(variablesFiltro);
    
    d3.select("#g_crecimiento").attr("class","background_cargando");
    $.post("FilterServlet", JSON.stringify({variablesGroup:"crecimiento",variablesFiltro:variablesFiltro}), function(data){
        d3.select("#g_crecimiento").attr("class","background_none");
       
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
    
    $.post("FilterSankeyServlet", JSON.stringify(variablesFiltro), function(data){
        sankey.data(data);
        sankey.update();    
    });
    
    d3.select("#g_nutricion").attr("class","background_cargando");
    $.post("FilterBarNegativeServlet", JSON.stringify({variablesGroup:"nutricion",variablesFiltro:variablesFiltro}), function(dataNutricion){
        d3.select("#g_nutricion").attr("class","background_none");
       
        var min=0;
        var max=0;
        for(var i = 0; i < dataNutricion.length; i++){
            for(var j = 0; j < dataNutricion[i].categories.length; j++){
                
                var valor = parseInt(dataNutricion[i].categories[j].value);
                if(valor>max)
                    max = valor;
                if(valor<min)
                    min = valor;
            }
        }
        
        for(var i = 0; i < dataNutricion.length; i++){
            
            var resultGraph = $.grep(lstGraphsNutricion, function(e){ return e.nameVariable == dataNutricion[i].nameVariable; });
            if (resultGraph.length != 0) {
                resultGraph[0].graph.data(dataNutricion[i].categories);
                resultGraph[0].graph.min(min);
                resultGraph[0].graph.max(max);
                resultGraph[0].graph.nameVariable(dataNutricion[i].nameVariable);
                resultGraph[0].graph.labelVariable(dataNutricion[i].labelVariable);
                resultGraph[0].graph.update();
            }
        }
    });

    d3.select("#g_coeficiente").attr("class","background_cargando");
    $.post("FilterBarGroupServlet", JSON.stringify({variablesGroup:"coeficiente",variablesFiltro:variablesFiltro}), function(dataCoeficiente){
        d3.select("#g_coeficiente").attr("class","background_none");
        barGroup.data(dataCoeficiente);
        barGroup.filtered(existeFiltro("CD6_CD12"));
        barGroup.update(); 
    });
    

}

function removeVariableFilter(nameVariable){

    eliminarVariablesFiltro(nameVariable);
    updateData();
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

function updateVariablesMatch(varMatch){
 
    if(varMatch.nameVariable.includes("CD6")){
        
        var varMatchAux = new Object;
        Object.assign(varMatchAux, varMatch);
        
        varMatch.nameVariable = "CD6";
        
        varMatchAux.nameVariable = "CD12";
        agregarVariablesFiltro(varMatchAux);
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

