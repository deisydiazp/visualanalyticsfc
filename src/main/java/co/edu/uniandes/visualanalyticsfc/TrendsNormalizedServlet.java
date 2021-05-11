/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package co.edu.uniandes.visualanalyticsfc;

import co.edu.uniandes.visualanalyticsfc.dto.DesviacionDTO;
import co.edu.uniandes.visualanalyticsfc.dto.DesviacionPorMedidaDTO;
import co.edu.uniandes.visualanalyticsfc.dto.MedidaDTO;
import co.edu.uniandes.visualanalyticsfc.dto.VariableFilterDTO;
import co.edu.uniandes.visualanalyticsfc.dto.VariableFilterMeasureDTO;
import co.edu.uniandes.visualanalyticsfc.dto.VectoresInicioDTO;
import com.google.gson.Gson;
import com.mongodb.MongoClient;
import com.mongodb.MongoClientURI;
import com.mongodb.client.AggregateIterable;
import com.mongodb.client.MongoCollection;
import com.mongodb.client.MongoDatabase;
import com.mongodb.client.model.Projections;
import java.io.IOException;
import java.io.PrintWriter;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.Comparator;
import java.util.List;
import java.util.ResourceBundle;
import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import org.apache.commons.io.IOUtils;
import org.bson.Document;
import org.bson.conversions.Bson;
import static com.mongodb.client.model.Filters.and;


/**
 *
 * @author Deisy
 */
@WebServlet(name = "TrendsNormalizedServlet", urlPatterns = {"/TrendsNormalizedServlet"})
public class TrendsNormalizedServlet extends HttpServlet {

    public static final String[] lstLabels = { "sem24","sem25","sem26","sem27","sem28","sem29","sem30","sem31","sem32","sem33",
                                                "sem34","sem35","sem36","sem37","sem38","sem39","sem40",
                                                "mes3","mes6","mes9","mes12"};
    /**
     * Handles the HTTP <code>GET</code> method.
     *
     * @param request servlet request
     * @param response servlet response
     * @throws ServletException if a servlet-specific error occurs
     * @throws IOException if an I/O error occurs
     */
    @Override
    protected void doGet(HttpServletRequest request, HttpServletResponse response)
            throws ServletException, IOException {
        
        response.setContentType("application/json;charset=UTF-8");
        try (PrintWriter out = response.getWriter()) {
            
        }
        
    }
    
    private static String getCadMatch(VariableFilterDTO variable){
        
        String cadMatch = "";
        
        if(variable.getNameVariable().equals("percapitasalariominimo")){
            cadMatch = "{$or:[";
            for(String range: variable.getValuesFilters()){
                switch (range) {
                case "grupo_0": 
                    cadMatch += "{'percapitasalariominimo' : {$lte: 0}},";
                    break;
                case "grupo_1":   
                    cadMatch += "{'percapitasalariominimo' : {$gt: 0, $lt: 1}},";
                    break;
                case "grupo_2":   
                    cadMatch = "{'percapitasalariominimo' : {$gte: 1, $lt: 2}},";
                    break; 
                case "grupo_3":   
                    cadMatch += "{'percapitasalariominimo' : {$gte: 2, $lte: 3}},";
                    break; 
                case "grupo_4":   
                    cadMatch += "{'percapitasalariominimo' : {$gt: 3}},";
                    break;     
                 case "grupo_5":   
                    cadMatch += "{'percapitasalariominimo' : {$exists: false}},";
                    break; 
               }
            }
            cadMatch += "]},";
            
            return cadMatch;
        } 
        
        if (variable.getNameVariable().equals("CD6") || variable.getNameVariable().equals("CD12")) {
            cadMatch = "{$or:[";
            for (String range : variable.getValuesFilters()) {
                switch (range) {
                    case "<60":
                        cadMatch += "{'" + variable.getNameVariable() + "' : {$lt: 60}},";
                        break;
                    case "60-69":
                        cadMatch += "{'" + variable.getNameVariable() + "' : {$gte: 60, $lt: 70}},";
                        break;
                    case "70-79":
                        cadMatch += "{'" + variable.getNameVariable() + "' : {$gte: 70, $lt: 80}},";
                        break;
                    case "80-89":
                        cadMatch += "{'" + variable.getNameVariable() +"' : {$gte: 80, $lt: 90}},";
                        break;
                    case "90-99":
                        cadMatch += "{'" + variable.getNameVariable() +"' : {$gte: 90, $lt: 100}},";
                        break;
                    case "100-109":
                        cadMatch += "{'" + variable.getNameVariable() +"' : {$gte: 100, $lt: 110}},";
                        break;
                    case "110-119":
                        cadMatch += "{'" + variable.getNameVariable() +"' : {$gte: 110, $lt: 120}},";
                        break;
                    case ">120":
                        cadMatch += "{'" + variable.getNameVariable() + "' : {$gt: 120}},";
                        break;    
                }
            }
            cadMatch += "]},";

            return cadMatch;
        }
        
        if(variable.getTypeFilter().equals("range")){
            cadMatch = "{'" + variable.getNameVariable() + "':{$gte:" + variable.getValuesFilters().get(0) + ", $lte:" + variable.getValuesFilters().get(1) + "}},";
        }
        if(variable.getTypeFilter().equals("or")){
            cadMatch = "{$or:[";
            for(String value : variable.getValuesFilters()){
                /*if(value.equals(""))
                    value="''";*/
                cadMatch += "{'" + variable.getNameVariable() + "':" + value + "},";
            }
            cadMatch += "]},";
         }
        
        if(variable.getTypeFilter().equals("none")){
            cadMatch = "{'" + variable.getNameVariable() + "':'" + variable.getValuesFilters().get(0) + "'},";
        }
        
        return cadMatch;
    }
    
    private static VectoresInicioDTO getMeasures(VariableFilterMeasureDTO filters){
        
        System.out.println("--------------Consulta medidas crecimiento normalizadas ----------------------");
        //Document doc = Document.parse("{'ANOCAT':{$in:[1993,1994]}, 'sexo':2, $or:[{'peso.sem39':{$ne:null}},{'peso.sem31':{$ne:null}}],'peso.error':false, 'peso.outlier':false}");
        String cadMatch = "";
        for(VariableFilterDTO var : filters.getFilters()){
              
            cadMatch += getCadMatch(var);
        }
        
        
        //**** se cuentan todos los registros sin importar sin son errores o outliers
        String cadContarRegistros = "{$and: [" + cadMatch + "]}"; 
        cadContarRegistros = cadContarRegistros.replace(",}", "}");
        cadContarRegistros = cadContarRegistros.replace(",]", "]");
                
        //***** Se crea la cadena match para contar la cantidad de registros marcados como error 
        String cadConErrores = "{'" + filters.getMeasure() + ".error':true},";
        String cadSinErrores = "{'" + filters.getMeasure() + ".error':false},";
        
        String cadenaContarErrores = "{$and: [" + cadMatch + cadConErrores + "]}";
        cadenaContarErrores = cadenaContarErrores.replace(",}", "}");
        cadenaContarErrores = cadenaContarErrores.replace(",]", "]");
        
         //***** Se crea la cadena match para contar la cantidad de registros marcados como outlier 
        String cadConOutliers = "{'" + filters.getMeasure() + ".outlier':true},";
        String cadSinOutliers = "{'" + filters.getMeasure() + ".outlier':{$ne:true}},";
        
        String cadenaContarOutliers = "{$and: [" + cadMatch + cadConOutliers + cadSinErrores + "]}";
        cadenaContarOutliers = cadenaContarOutliers.replace(",}", "}");
        cadenaContarOutliers = cadenaContarOutliers.replace(",]", "]");
        
        
        //***** Se crea la cadena match para consultar la tendencias de crecimiento
        if(!filters.isOutlier())
            cadMatch += cadSinOutliers;
        
        String cadenaMatchFiltros = "{$and: [" + cadMatch + cadSinErrores + "]}";    
        cadenaMatchFiltros = cadenaMatchFiltros.replace(",}", "}");
        cadenaMatchFiltros = cadenaMatchFiltros.replace(",]", "]");
        
        
        System.out.println( "****************cadenaMatchFiltros  " + cadenaMatchFiltros 
                            + "**************cadenaContarErrores " + cadenaContarErrores
                            + "**************cadenaContarOutliers " + cadenaContarOutliers);
        
        return ProcesarMedidas(cadenaMatchFiltros, cadenaContarErrores, cadenaContarOutliers, cadContarRegistros, filters.getGender(), filters.getMeasure() + "_normalizado");
    }
    
    private static VectoresInicioDTO ProcesarMedidas(String cadenaMatchFiltros, String cadenaContarErrores, String cadenaContarOutliers, String cadenaContarRegistros, int genero, String tipoMedida){
        
        String nameDB = ResourceBundle.getBundle("propiedades").getString("nameDB");
        String conexionDB = ResourceBundle.getBundle("propiedades").getString("conexionDB");
        MongoDatabase mongoDB = new MongoClient(new MongoClientURI(conexionDB)).getDatabase(nameDB);  
        
        
        MongoCollection collectionMedidasCrecimiento = mongoDB.getCollection("medidas_crecimiento");
        
        
        //**********De acuerdo a los filtros seleccionados se obtienen las tendencias correspondientes 
        Document docFilter = Document.parse(cadenaMatchFiltros);
        List<Document> docMedidas = (List<Document>) collectionMedidasCrecimiento.find(docFilter).projection(Projections.include(tipoMedida,"alimentacion", "CODE")).into(new ArrayList<Document>());
        System.out.println("--------------Fin consulta medidas crecimiento------------------" + docMedidas.size());
        
        //**********Obtiene la cantidad de registros
        Bson docCantRegistros = Document.parse(cadenaContarRegistros);
        long cantRegistros = collectionMedidasCrecimiento.count(docCantRegistros);
        
        //**********Obtiene la cantidad de registros marcados como error segun los filtros
        Bson docCantErrores = Document.parse(cadenaContarErrores);
        long cantErrores = collectionMedidasCrecimiento.count(docCantErrores);


        //**********Obtiene la cantidad de registros marcados como outlier
        Bson docCantOutliers = Document.parse(cadenaContarOutliers);
        long cantOutliers = collectionMedidasCrecimiento.count(docCantOutliers);
        
        
        //**********Se obtiene medidas de las desviaciones por semana
        MongoCollection collectionMedidasEstandar = mongoDB.getCollection("medidas_estandar");
        List<Document> docDesviaciones = (List<Document>) collectionMedidasEstandar.find(and(new Document("sexo",genero),new Document("tipo_medida",tipoMedida))).into(new ArrayList<Document>());

        List<DesviacionPorMedidaDTO> lstMedidasEstandar = new ArrayList<DesviacionPorMedidaDTO>();

        for(Document desviacion : docDesviaciones){
            for(String nombreMedida : lstLabels){
                Document docDesviacion = (Document) desviacion.get(nombreMedida);
                DesviacionPorMedidaDTO desviacionMedida = new DesviacionPorMedidaDTO();
                desviacionMedida.setMedida(nombreMedida);
                DesviacionDTO desviacionDto = crearDesviacion(docDesviacion);
                desviacionMedida.setDesviaciones(desviacionDto);
                lstMedidasEstandar.add(desviacionMedida);
            }
        }

        //**********Se obtiene minimos y maximos por edad segun filtros
        Bson match = new Document("$match",docFilter);
        AggregateIterable<Document> docLimites = collectionMedidasCrecimiento.aggregate(Arrays.asList(
                match,
                new Document("$group", new Document("_id", "$max")
                    .append("sem24", new Document("$max", "$" + tipoMedida + ".sem24"))
                    .append("sem25", new Document("$max", "$" + tipoMedida + ".sem25"))
                    .append("sem26", new Document("$max", "$" + tipoMedida + ".sem26"))
                    .append("sem27", new Document("$max", "$" + tipoMedida + ".sem27"))
                    .append("sem28", new Document("$max", "$" + tipoMedida + ".sem28"))
                    .append("sem29", new Document("$max", "$" + tipoMedida + ".sem29"))
                    .append("sem30", new Document("$max", "$" + tipoMedida + ".sem30"))
                    .append("sem31", new Document("$max", "$" + tipoMedida + ".sem31"))
                    .append("sem32", new Document("$max", "$" + tipoMedida + ".sem32"))
                    .append("sem33", new Document("$max", "$" + tipoMedida + ".sem33"))
                    .append("sem34", new Document("$max", "$" + tipoMedida + ".sem34"))
                    .append("sem35", new Document("$max", "$" + tipoMedida + ".sem35"))
                    .append("sem36", new Document("$max", "$" + tipoMedida + ".sem36"))
                    .append("sem37", new Document("$max", "$" + tipoMedida + ".sem37"))
                    .append("sem38", new Document("$max", "$" + tipoMedida + ".sem38"))
                    .append("sem39", new Document("$max", "$" + tipoMedida + ".sem39"))
                    .append("sem40", new Document("$max", "$" + tipoMedida + ".sem40"))
                    .append("mes3", new Document("$max", "$" + tipoMedida + ".mes3"))
                    .append("mes6", new Document("$max", "$" + tipoMedida + ".mes6"))
                    .append("mes9", new Document("$max", "$" + tipoMedida + ".mes9"))
                    .append("mes12", new Document("$max", "$" + tipoMedida + ".mes12"))

                    .append("min_sem24", new Document("$min", "$" + tipoMedida + ".sem24"))
                    .append("min_sem25", new Document("$min", "$" + tipoMedida + ".sem25"))
                    .append("min_sem26", new Document("$min", "$" + tipoMedida + ".sem26"))
                    .append("min_sem27", new Document("$min", "$" + tipoMedida + ".sem27"))
                    .append("min_sem28", new Document("$min", "$" + tipoMedida + ".sem28"))
                    .append("min_sem29", new Document("$min", "$" + tipoMedida + ".sem29"))
                    .append("min_sem30", new Document("$min", "$" + tipoMedida + ".sem30"))
                    .append("min_sem31", new Document("$min", "$" + tipoMedida + ".sem31"))
                    .append("min_sem32", new Document("$min", "$" + tipoMedida + ".sem32"))
                    .append("min_sem33", new Document("$min", "$" + tipoMedida + ".sem33"))
                    .append("min_sem34", new Document("$min", "$" + tipoMedida + ".sem34"))
                    .append("min_sem35", new Document("$min", "$" + tipoMedida + ".sem35"))
                    .append("min_sem36", new Document("$min", "$" + tipoMedida + ".sem36"))
                    .append("min_sem37", new Document("$min", "$" + tipoMedida + ".sem37"))
                    .append("min_sem38", new Document("$min", "$" + tipoMedida + ".sem38"))
                    .append("min_sem39", new Document("$min", "$" + tipoMedida + ".sem39"))
                    .append("min_sem40", new Document("$min", "$" + tipoMedida + ".sem40"))
                    .append("min_mes3", new Document("$min", "$" + tipoMedida + ".mes3"))
                    .append("min_mes6", new Document("$min", "$" + tipoMedida + ".mes6"))
                    .append("min_mes9", new Document("$min", "$" + tipoMedida + ".mes9"))
                    .append("min_mes12", new Document("$min", "$" + tipoMedida + ".mes12")))        
            ));


        //-----------------------------------------------------------------------//
        MedidaDTO medidaMax = new MedidaDTO();
        MedidaDTO medidaMin = new MedidaDTO();

        for (Document doc : docLimites) {
                medidaMax.setCODE("max");
                medidaMax.setSem24(doc.get("sem24") == null ? lstMedidasEstandar.get(0).getDesviaciones().getDes_3(): (double) doc.get("sem24"));
                medidaMax.setSem25(doc.get("sem25") == null ? lstMedidasEstandar.get(1).getDesviaciones().getDes_3():(double) doc.get("sem25"));
                medidaMax.setSem26(doc.get("sem26") == null ? lstMedidasEstandar.get(2).getDesviaciones().getDes_3():(double) doc.get("sem26"));
                medidaMax.setSem27(doc.get("sem27") == null ? lstMedidasEstandar.get(3).getDesviaciones().getDes_3():(double) doc.get("sem27"));
                medidaMax.setSem28(doc.get("sem28") == null ? lstMedidasEstandar.get(4).getDesviaciones().getDes_3():(double) doc.get("sem28"));
                medidaMax.setSem29(doc.get("sem29") == null ? lstMedidasEstandar.get(5).getDesviaciones().getDes_3():(double) doc.get("sem29"));
                medidaMax.setSem30(doc.get("sem30") == null ? lstMedidasEstandar.get(6).getDesviaciones().getDes_3():(double) doc.get("sem30"));
                medidaMax.setSem31(doc.get("sem31") == null ? lstMedidasEstandar.get(7).getDesviaciones().getDes_3():(double) doc.get("sem31"));
                medidaMax.setSem32(doc.get("sem32") == null ? lstMedidasEstandar.get(8).getDesviaciones().getDes_3():(double) doc.get("sem32"));
                medidaMax.setSem33(doc.get("sem33") == null ? lstMedidasEstandar.get(9).getDesviaciones().getDes_3():(double) doc.get("sem33"));
                medidaMax.setSem34(doc.get("sem34") == null ? lstMedidasEstandar.get(10).getDesviaciones().getDes_3():(double) doc.get("sem34"));
                medidaMax.setSem35(doc.get("sem35") == null ? lstMedidasEstandar.get(11).getDesviaciones().getDes_3():(double) doc.get("sem35"));
                medidaMax.setSem36(doc.get("sem36") == null ? lstMedidasEstandar.get(12).getDesviaciones().getDes_3():(double) doc.get("sem36"));
                medidaMax.setSem37(doc.get("sem37") == null ? lstMedidasEstandar.get(13).getDesviaciones().getDes_3():(double) doc.get("sem37"));
                medidaMax.setSem38(doc.get("sem38") == null ? lstMedidasEstandar.get(14).getDesviaciones().getDes_3():(double) doc.get("sem38"));
                medidaMax.setSem39(doc.get("sem39") == null ? lstMedidasEstandar.get(15).getDesviaciones().getDes_3():(double) doc.get("sem39"));
                medidaMax.setSem40(doc.get("sem40") == null ? lstMedidasEstandar.get(16).getDesviaciones().getDes_3():(double) doc.get("sem40"));
                medidaMax.setMes3(doc.get("mes3") == null ? lstMedidasEstandar.get(17).getDesviaciones().getDes_3():(double) doc.get("mes3"));
                medidaMax.setMes6(doc.get("mes6") == null ? lstMedidasEstandar.get(18).getDesviaciones().getDes_3():(double) doc.get("mes6"));
                medidaMax.setMes9(doc.get("mes9") == null ? lstMedidasEstandar.get(19).getDesviaciones().getDes_3():(double) doc.get("mes9"));
                medidaMax.setMes12(doc.get("mes12") == null ? lstMedidasEstandar.get(20).getDesviaciones().getDes_3():(double) doc.get("mes12"));

                medidaMin.setCODE("min");
                medidaMin.setSem24(doc.get("min_sem24") == null ? lstMedidasEstandar.get(0).getDesviaciones().getDes_3Neg(): (double) doc.get("min_sem24"));
                medidaMin.setSem25(doc.get("min_sem25") == null ? lstMedidasEstandar.get(1).getDesviaciones().getDes_3Neg(): (double) doc.get("min_sem25"));
                medidaMin.setSem26(doc.get("min_sem26") == null ? lstMedidasEstandar.get(2).getDesviaciones().getDes_3Neg(): (double) doc.get("min_sem26"));
                medidaMin.setSem27(doc.get("min_sem27") == null ? lstMedidasEstandar.get(3).getDesviaciones().getDes_3Neg(): (double) doc.get("min_sem27"));
                medidaMin.setSem28(doc.get("min_sem28") == null ? lstMedidasEstandar.get(4).getDesviaciones().getDes_3Neg(): (double) doc.get("min_sem28"));
                medidaMin.setSem29(doc.get("min_sem29") == null ? lstMedidasEstandar.get(5).getDesviaciones().getDes_3Neg(): (double) doc.get("min_sem29"));
                medidaMin.setSem30(doc.get("min_sem30") == null ? lstMedidasEstandar.get(6).getDesviaciones().getDes_3Neg(): (double) doc.get("min_sem30"));
                medidaMin.setSem31(doc.get("min_sem31") == null ? lstMedidasEstandar.get(7).getDesviaciones().getDes_3Neg(): (double) doc.get("min_sem31"));
                medidaMin.setSem32(doc.get("min_sem32") == null ? lstMedidasEstandar.get(8).getDesviaciones().getDes_3Neg(): (double) doc.get("min_sem32"));
                medidaMin.setSem33(doc.get("min_sem33") == null ? lstMedidasEstandar.get(9).getDesviaciones().getDes_3Neg(): (double) doc.get("min_sem33"));
                medidaMin.setSem34(doc.get("min_sem34") == null ? lstMedidasEstandar.get(10).getDesviaciones().getDes_3Neg(): (double) doc.get("min_sem34"));
                medidaMin.setSem35(doc.get("min_sem35") == null ? lstMedidasEstandar.get(11).getDesviaciones().getDes_3Neg(): (double) doc.get("min_sem35"));
                medidaMin.setSem36(doc.get("min_sem36") == null ? lstMedidasEstandar.get(12).getDesviaciones().getDes_3Neg(): (double) doc.get("min_sem36"));
                medidaMin.setSem37(doc.get("min_sem37") == null ? lstMedidasEstandar.get(13).getDesviaciones().getDes_3Neg(): (double) doc.get("min_sem37"));
                medidaMin.setSem38(doc.get("min_sem38") == null ? lstMedidasEstandar.get(14).getDesviaciones().getDes_3Neg(): (double) doc.get("min_sem38"));
                medidaMin.setSem39(doc.get("min_sem39") == null ? lstMedidasEstandar.get(15).getDesviaciones().getDes_3Neg(): (double) doc.get("min_sem39"));
                medidaMin.setSem40(doc.get("min_sem40") == null ? lstMedidasEstandar.get(16).getDesviaciones().getDes_3Neg(): (double) doc.get("min_sem40"));
                medidaMin.setMes3(doc.get("min_mes3") == null ? lstMedidasEstandar.get(17).getDesviaciones().getDes_3Neg(): (double) doc.get("min_mes3"));
                medidaMin.setMes6(doc.get("min_mes6") == null ? lstMedidasEstandar.get(18).getDesviaciones().getDes_3Neg(): (double) doc.get("min_mes6"));
                medidaMin.setMes9(doc.get("min_mes9") == null ? lstMedidasEstandar.get(19).getDesviaciones().getDes_3Neg(): (double) doc.get("min_mes9"));
                medidaMin.setMes12(doc.get("min_mes12") == null ? lstMedidasEstandar.get(20).getDesviaciones().getDes_3Neg(): (double) doc.get("min_mes12"));
            }
        //-----------------------------------------------------------------------//    
            
            
            Double[] arrProporMin =  {	
                (lstMedidasEstandar.get(0).getDesviaciones().getDes_3() - medidaMin.getSem24()) / (lstMedidasEstandar.get(0).getDesviaciones().getDes_3() - lstMedidasEstandar.get(0).getDesviaciones().getDes_3Neg()),
                (lstMedidasEstandar.get(1).getDesviaciones().getDes_3() - medidaMin.getSem25()) / (lstMedidasEstandar.get(1).getDesviaciones().getDes_3() - lstMedidasEstandar.get(1).getDesviaciones().getDes_3Neg()),
                (lstMedidasEstandar.get(2).getDesviaciones().getDes_3() - medidaMin.getSem26()) / (lstMedidasEstandar.get(2).getDesviaciones().getDes_3() - lstMedidasEstandar.get(2).getDesviaciones().getDes_3Neg()),
                (lstMedidasEstandar.get(3).getDesviaciones().getDes_3() - medidaMin.getSem27()) / (lstMedidasEstandar.get(3).getDesviaciones().getDes_3() - lstMedidasEstandar.get(3).getDesviaciones().getDes_3Neg()),
                (lstMedidasEstandar.get(4).getDesviaciones().getDes_3() - medidaMin.getSem28()) / (lstMedidasEstandar.get(4).getDesviaciones().getDes_3() - lstMedidasEstandar.get(4).getDesviaciones().getDes_3Neg()),
                (lstMedidasEstandar.get(5).getDesviaciones().getDes_3() - medidaMin.getSem29()) / (lstMedidasEstandar.get(5).getDesviaciones().getDes_3() - lstMedidasEstandar.get(5).getDesviaciones().getDes_3Neg()),
                (lstMedidasEstandar.get(6).getDesviaciones().getDes_3() - medidaMin.getSem30()) / (lstMedidasEstandar.get(6).getDesviaciones().getDes_3() - lstMedidasEstandar.get(6).getDesviaciones().getDes_3Neg()),
                (lstMedidasEstandar.get(7).getDesviaciones().getDes_3() - medidaMin.getSem31()) / (lstMedidasEstandar.get(7).getDesviaciones().getDes_3() - lstMedidasEstandar.get(7).getDesviaciones().getDes_3Neg()),
                (lstMedidasEstandar.get(8).getDesviaciones().getDes_3() - medidaMin.getSem32()) / (lstMedidasEstandar.get(8).getDesviaciones().getDes_3() - lstMedidasEstandar.get(8).getDesviaciones().getDes_3Neg()),
                (lstMedidasEstandar.get(9).getDesviaciones().getDes_3() - medidaMin.getSem33()) / (lstMedidasEstandar.get(9).getDesviaciones().getDes_3() - lstMedidasEstandar.get(9).getDesviaciones().getDes_3Neg()),
                (lstMedidasEstandar.get(10).getDesviaciones().getDes_3() - medidaMin.getSem34()) / (lstMedidasEstandar.get(10).getDesviaciones().getDes_3() - lstMedidasEstandar.get(10).getDesviaciones().getDes_3Neg()),
                (lstMedidasEstandar.get(11).getDesviaciones().getDes_3() - medidaMin.getSem35()) / (lstMedidasEstandar.get(11).getDesviaciones().getDes_3() - lstMedidasEstandar.get(11).getDesviaciones().getDes_3Neg()),
                (lstMedidasEstandar.get(12).getDesviaciones().getDes_3() - medidaMin.getSem36()) / (lstMedidasEstandar.get(12).getDesviaciones().getDes_3() - lstMedidasEstandar.get(12).getDesviaciones().getDes_3Neg()),
                (lstMedidasEstandar.get(13).getDesviaciones().getDes_3() - medidaMin.getSem37()) / (lstMedidasEstandar.get(13).getDesviaciones().getDes_3() - lstMedidasEstandar.get(13).getDesviaciones().getDes_3Neg()),
                (lstMedidasEstandar.get(14).getDesviaciones().getDes_3() - medidaMin.getSem38()) / (lstMedidasEstandar.get(14).getDesviaciones().getDes_3() - lstMedidasEstandar.get(14).getDesviaciones().getDes_3Neg()),
                (lstMedidasEstandar.get(15).getDesviaciones().getDes_3() - medidaMin.getSem39()) / (lstMedidasEstandar.get(15).getDesviaciones().getDes_3() - lstMedidasEstandar.get(15).getDesviaciones().getDes_3Neg()),
                (lstMedidasEstandar.get(16).getDesviaciones().getDes_3() - medidaMin.getSem40()) / (lstMedidasEstandar.get(16).getDesviaciones().getDes_3() - lstMedidasEstandar.get(16).getDesviaciones().getDes_3Neg()),
                (lstMedidasEstandar.get(17).getDesviaciones().getDes_3() - medidaMin.getMes3()) / (lstMedidasEstandar.get(17).getDesviaciones().getDes_3() - lstMedidasEstandar.get(17).getDesviaciones().getDes_3Neg()),
                (lstMedidasEstandar.get(18).getDesviaciones().getDes_3() - medidaMin.getMes6()) / (lstMedidasEstandar.get(18).getDesviaciones().getDes_3() - lstMedidasEstandar.get(18).getDesviaciones().getDes_3Neg()),
                (lstMedidasEstandar.get(19).getDesviaciones().getDes_3() - medidaMin.getMes9()) / (lstMedidasEstandar.get(19).getDesviaciones().getDes_3() - lstMedidasEstandar.get(19).getDesviaciones().getDes_3Neg()),
                (lstMedidasEstandar.get(20).getDesviaciones().getDes_3() - medidaMin.getMes12()) / (lstMedidasEstandar.get(20).getDesviaciones().getDes_3() - lstMedidasEstandar.get(20).getDesviaciones().getDes_3Neg())
            };

            List<Double> ordenarList = Arrays.asList(arrProporMin);
            final Comparator<Double> comp = (p1, p2) -> Double.compare( p1, p2);
            double proporMax = ordenarList.stream().max(comp).get();

            double[] arrMin1 =   {	
                lstMedidasEstandar.get(0).getDesviaciones().getDes_3() - (lstMedidasEstandar.get(0).getDesviaciones().getDes_3() - lstMedidasEstandar.get(0).getDesviaciones().getDes_3Neg()) * proporMax,
                lstMedidasEstandar.get(1).getDesviaciones().getDes_3() - (lstMedidasEstandar.get(1).getDesviaciones().getDes_3() - lstMedidasEstandar.get(1).getDesviaciones().getDes_3Neg()) * proporMax,
                lstMedidasEstandar.get(2).getDesviaciones().getDes_3() - (lstMedidasEstandar.get(2).getDesviaciones().getDes_3() - lstMedidasEstandar.get(2).getDesviaciones().getDes_3Neg()) * proporMax,
                lstMedidasEstandar.get(3).getDesviaciones().getDes_3() - (lstMedidasEstandar.get(3).getDesviaciones().getDes_3() - lstMedidasEstandar.get(3).getDesviaciones().getDes_3Neg()) * proporMax,
                lstMedidasEstandar.get(4).getDesviaciones().getDes_3() - (lstMedidasEstandar.get(4).getDesviaciones().getDes_3() - lstMedidasEstandar.get(4).getDesviaciones().getDes_3Neg()) * proporMax,
                lstMedidasEstandar.get(5).getDesviaciones().getDes_3() - (lstMedidasEstandar.get(5).getDesviaciones().getDes_3() - lstMedidasEstandar.get(5).getDesviaciones().getDes_3Neg()) * proporMax,
                lstMedidasEstandar.get(6).getDesviaciones().getDes_3() - (lstMedidasEstandar.get(6).getDesviaciones().getDes_3() - lstMedidasEstandar.get(6).getDesviaciones().getDes_3Neg()) * proporMax,
                lstMedidasEstandar.get(7).getDesviaciones().getDes_3() - (lstMedidasEstandar.get(7).getDesviaciones().getDes_3() - lstMedidasEstandar.get(7).getDesviaciones().getDes_3Neg()) * proporMax,
                lstMedidasEstandar.get(8).getDesviaciones().getDes_3() - (lstMedidasEstandar.get(8).getDesviaciones().getDes_3() - lstMedidasEstandar.get(8).getDesviaciones().getDes_3Neg()) * proporMax,
                lstMedidasEstandar.get(9).getDesviaciones().getDes_3() - (lstMedidasEstandar.get(9).getDesviaciones().getDes_3() - lstMedidasEstandar.get(9).getDesviaciones().getDes_3Neg()) * proporMax,
                lstMedidasEstandar.get(10).getDesviaciones().getDes_3() - (lstMedidasEstandar.get(10).getDesviaciones().getDes_3() - lstMedidasEstandar.get(10).getDesviaciones().getDes_3Neg()) * proporMax,
                lstMedidasEstandar.get(11).getDesviaciones().getDes_3() - (lstMedidasEstandar.get(11).getDesviaciones().getDes_3() - lstMedidasEstandar.get(11).getDesviaciones().getDes_3Neg()) * proporMax,
                lstMedidasEstandar.get(12).getDesviaciones().getDes_3() - (lstMedidasEstandar.get(12).getDesviaciones().getDes_3() - lstMedidasEstandar.get(12).getDesviaciones().getDes_3Neg()) * proporMax,
                lstMedidasEstandar.get(13).getDesviaciones().getDes_3() - (lstMedidasEstandar.get(13).getDesviaciones().getDes_3() - lstMedidasEstandar.get(13).getDesviaciones().getDes_3Neg()) * proporMax,
                lstMedidasEstandar.get(14).getDesviaciones().getDes_3() - (lstMedidasEstandar.get(14).getDesviaciones().getDes_3() - lstMedidasEstandar.get(14).getDesviaciones().getDes_3Neg()) * proporMax,
                lstMedidasEstandar.get(15).getDesviaciones().getDes_3() - (lstMedidasEstandar.get(15).getDesviaciones().getDes_3() - lstMedidasEstandar.get(15).getDesviaciones().getDes_3Neg()) * proporMax,
                lstMedidasEstandar.get(16).getDesviaciones().getDes_3() - (lstMedidasEstandar.get(16).getDesviaciones().getDes_3() - lstMedidasEstandar.get(16).getDesviaciones().getDes_3Neg()) * proporMax,
                lstMedidasEstandar.get(17).getDesviaciones().getDes_3() - (lstMedidasEstandar.get(17).getDesviaciones().getDes_3() - lstMedidasEstandar.get(17).getDesviaciones().getDes_3Neg()) * proporMax,
                lstMedidasEstandar.get(18).getDesviaciones().getDes_3() - (lstMedidasEstandar.get(18).getDesviaciones().getDes_3() - lstMedidasEstandar.get(18).getDesviaciones().getDes_3Neg()) * proporMax,
                lstMedidasEstandar.get(19).getDesviaciones().getDes_3() - (lstMedidasEstandar.get(19).getDesviaciones().getDes_3() - lstMedidasEstandar.get(19).getDesviaciones().getDes_3Neg()) * proporMax,
                lstMedidasEstandar.get(20).getDesviaciones().getDes_3() - (lstMedidasEstandar.get(20).getDesviaciones().getDes_3() - lstMedidasEstandar.get(20).getDesviaciones().getDes_3Neg()) * proporMax,
            };

            Double[] arrProporMax =  {
                (medidaMax.getSem24() - lstMedidasEstandar.get(0).getDesviaciones().getDes_3()) / (lstMedidasEstandar.get(0).getDesviaciones().getDes_3() - lstMedidasEstandar.get(0).getDesviaciones().getDes_3Neg()),
                (medidaMax.getSem25() - lstMedidasEstandar.get(1).getDesviaciones().getDes_3()) / (lstMedidasEstandar.get(1).getDesviaciones().getDes_3() - lstMedidasEstandar.get(1).getDesviaciones().getDes_3Neg()),
                (medidaMax.getSem26() - lstMedidasEstandar.get(2).getDesviaciones().getDes_3()) / (lstMedidasEstandar.get(2).getDesviaciones().getDes_3() - lstMedidasEstandar.get(2).getDesviaciones().getDes_3Neg()),
                (medidaMax.getSem27() - lstMedidasEstandar.get(3).getDesviaciones().getDes_3()) / (lstMedidasEstandar.get(3).getDesviaciones().getDes_3() - lstMedidasEstandar.get(3).getDesviaciones().getDes_3Neg()),
                (medidaMax.getSem28() - lstMedidasEstandar.get(4).getDesviaciones().getDes_3()) / (lstMedidasEstandar.get(4).getDesviaciones().getDes_3() - lstMedidasEstandar.get(4).getDesviaciones().getDes_3Neg()),
                (medidaMax.getSem29() - lstMedidasEstandar.get(5).getDesviaciones().getDes_3()) / (lstMedidasEstandar.get(5).getDesviaciones().getDes_3() - lstMedidasEstandar.get(5).getDesviaciones().getDes_3Neg()),
                (medidaMax.getSem30() - lstMedidasEstandar.get(6).getDesviaciones().getDes_3()) / (lstMedidasEstandar.get(6).getDesviaciones().getDes_3() - lstMedidasEstandar.get(6).getDesviaciones().getDes_3Neg()),
                (medidaMax.getSem31() - lstMedidasEstandar.get(7).getDesviaciones().getDes_3()) / (lstMedidasEstandar.get(7).getDesviaciones().getDes_3() - lstMedidasEstandar.get(7).getDesviaciones().getDes_3Neg()),
                (medidaMax.getSem32() - lstMedidasEstandar.get(8).getDesviaciones().getDes_3()) / (lstMedidasEstandar.get(8).getDesviaciones().getDes_3() - lstMedidasEstandar.get(8).getDesviaciones().getDes_3Neg()),
                (medidaMax.getSem33() - lstMedidasEstandar.get(9).getDesviaciones().getDes_3()) / (lstMedidasEstandar.get(9).getDesviaciones().getDes_3() - lstMedidasEstandar.get(9).getDesviaciones().getDes_3Neg()),
                (medidaMax.getSem34() - lstMedidasEstandar.get(10).getDesviaciones().getDes_3()) / (lstMedidasEstandar.get(10).getDesviaciones().getDes_3() - lstMedidasEstandar.get(10).getDesviaciones().getDes_3Neg()),
                (medidaMax.getSem35() - lstMedidasEstandar.get(11).getDesviaciones().getDes_3()) / (lstMedidasEstandar.get(11).getDesviaciones().getDes_3() - lstMedidasEstandar.get(11).getDesviaciones().getDes_3Neg()),
                (medidaMax.getSem36() - lstMedidasEstandar.get(12).getDesviaciones().getDes_3()) / (lstMedidasEstandar.get(12).getDesviaciones().getDes_3() - lstMedidasEstandar.get(12).getDesviaciones().getDes_3Neg()),
                (medidaMax.getSem37() - lstMedidasEstandar.get(13).getDesviaciones().getDes_3()) / (lstMedidasEstandar.get(13).getDesviaciones().getDes_3() - lstMedidasEstandar.get(13).getDesviaciones().getDes_3Neg()),
                (medidaMax.getSem38() - lstMedidasEstandar.get(14).getDesviaciones().getDes_3()) / (lstMedidasEstandar.get(14).getDesviaciones().getDes_3() - lstMedidasEstandar.get(14).getDesviaciones().getDes_3Neg()),
                (medidaMax.getSem39() - lstMedidasEstandar.get(15).getDesviaciones().getDes_3()) / (lstMedidasEstandar.get(15).getDesviaciones().getDes_3() - lstMedidasEstandar.get(15).getDesviaciones().getDes_3Neg()),
                (medidaMax.getSem40() - lstMedidasEstandar.get(16).getDesviaciones().getDes_3()) / (lstMedidasEstandar.get(16).getDesviaciones().getDes_3() - lstMedidasEstandar.get(16).getDesviaciones().getDes_3Neg()),
                (medidaMax.getMes3() - lstMedidasEstandar.get(17).getDesviaciones().getDes_3()) / (lstMedidasEstandar.get(17).getDesviaciones().getDes_3() - lstMedidasEstandar.get(17).getDesviaciones().getDes_3Neg()),
                (medidaMax.getMes6() - lstMedidasEstandar.get(18).getDesviaciones().getDes_3()) / (lstMedidasEstandar.get(18).getDesviaciones().getDes_3() - lstMedidasEstandar.get(18).getDesviaciones().getDes_3Neg()),
                (medidaMax.getMes9() - lstMedidasEstandar.get(19).getDesviaciones().getDes_3()) / (lstMedidasEstandar.get(19).getDesviaciones().getDes_3() - lstMedidasEstandar.get(19).getDesviaciones().getDes_3Neg()),
                (medidaMax.getMes12() - lstMedidasEstandar.get(20).getDesviaciones().getDes_3()) / (lstMedidasEstandar.get(20).getDesviaciones().getDes_3() - lstMedidasEstandar.get(20).getDesviaciones().getDes_3Neg())
            };

            ordenarList = Arrays.asList(arrProporMax);
            proporMax = ordenarList.stream().max(comp).get();

            double[] arrMax1 = {	
                lstMedidasEstandar.get(0).getDesviaciones().getDes_3() + (lstMedidasEstandar.get(0).getDesviaciones().getDes_3() - lstMedidasEstandar.get(0).getDesviaciones().getDes_3Neg()) * proporMax,
                lstMedidasEstandar.get(1).getDesviaciones().getDes_3() + (lstMedidasEstandar.get(1).getDesviaciones().getDes_3() - lstMedidasEstandar.get(1).getDesviaciones().getDes_3Neg()) * proporMax,
                lstMedidasEstandar.get(2).getDesviaciones().getDes_3() + (lstMedidasEstandar.get(2).getDesviaciones().getDes_3() - lstMedidasEstandar.get(2).getDesviaciones().getDes_3Neg()) * proporMax,
                lstMedidasEstandar.get(3).getDesviaciones().getDes_3() + (lstMedidasEstandar.get(3).getDesviaciones().getDes_3() - lstMedidasEstandar.get(3).getDesviaciones().getDes_3Neg()) * proporMax,
                lstMedidasEstandar.get(4).getDesviaciones().getDes_3() + (lstMedidasEstandar.get(4).getDesviaciones().getDes_3() - lstMedidasEstandar.get(4).getDesviaciones().getDes_3Neg()) * proporMax,
                lstMedidasEstandar.get(5).getDesviaciones().getDes_3() + (lstMedidasEstandar.get(5).getDesviaciones().getDes_3() - lstMedidasEstandar.get(5).getDesviaciones().getDes_3Neg()) * proporMax,
                lstMedidasEstandar.get(6).getDesviaciones().getDes_3() + (lstMedidasEstandar.get(6).getDesviaciones().getDes_3() - lstMedidasEstandar.get(6).getDesviaciones().getDes_3Neg()) * proporMax,
                lstMedidasEstandar.get(7).getDesviaciones().getDes_3() + (lstMedidasEstandar.get(7).getDesviaciones().getDes_3() - lstMedidasEstandar.get(7).getDesviaciones().getDes_3Neg()) * proporMax,
                lstMedidasEstandar.get(8).getDesviaciones().getDes_3() + (lstMedidasEstandar.get(8).getDesviaciones().getDes_3() - lstMedidasEstandar.get(8).getDesviaciones().getDes_3Neg()) * proporMax,
                lstMedidasEstandar.get(9).getDesviaciones().getDes_3() + (lstMedidasEstandar.get(9).getDesviaciones().getDes_3() - lstMedidasEstandar.get(9).getDesviaciones().getDes_3Neg()) * proporMax,
                lstMedidasEstandar.get(10).getDesviaciones().getDes_3() + (lstMedidasEstandar.get(10).getDesviaciones().getDes_3() - lstMedidasEstandar.get(10).getDesviaciones().getDes_3Neg()) * proporMax,
                lstMedidasEstandar.get(11).getDesviaciones().getDes_3() + (lstMedidasEstandar.get(11).getDesviaciones().getDes_3() - lstMedidasEstandar.get(11).getDesviaciones().getDes_3Neg()) * proporMax,
                lstMedidasEstandar.get(12).getDesviaciones().getDes_3() + (lstMedidasEstandar.get(12).getDesviaciones().getDes_3() - lstMedidasEstandar.get(12).getDesviaciones().getDes_3Neg()) * proporMax,
                lstMedidasEstandar.get(13).getDesviaciones().getDes_3() + (lstMedidasEstandar.get(13).getDesviaciones().getDes_3() - lstMedidasEstandar.get(13).getDesviaciones().getDes_3Neg()) * proporMax,
                lstMedidasEstandar.get(14).getDesviaciones().getDes_3() + (lstMedidasEstandar.get(14).getDesviaciones().getDes_3() - lstMedidasEstandar.get(14).getDesviaciones().getDes_3Neg()) * proporMax,
                lstMedidasEstandar.get(15).getDesviaciones().getDes_3() + (lstMedidasEstandar.get(15).getDesviaciones().getDes_3() - lstMedidasEstandar.get(15).getDesviaciones().getDes_3Neg()) * proporMax,
                lstMedidasEstandar.get(16).getDesviaciones().getDes_3() + (lstMedidasEstandar.get(16).getDesviaciones().getDes_3() - lstMedidasEstandar.get(16).getDesviaciones().getDes_3Neg()) * proporMax,
                lstMedidasEstandar.get(17).getDesviaciones().getDes_3() + (lstMedidasEstandar.get(17).getDesviaciones().getDes_3() - lstMedidasEstandar.get(17).getDesviaciones().getDes_3Neg()) * proporMax,
                lstMedidasEstandar.get(18).getDesviaciones().getDes_3() + (lstMedidasEstandar.get(18).getDesviaciones().getDes_3() - lstMedidasEstandar.get(18).getDesviaciones().getDes_3Neg()) * proporMax,
                lstMedidasEstandar.get(19).getDesviaciones().getDes_3() + (lstMedidasEstandar.get(19).getDesviaciones().getDes_3() - lstMedidasEstandar.get(19).getDesviaciones().getDes_3Neg()) * proporMax,
                lstMedidasEstandar.get(20).getDesviaciones().getDes_3() + (lstMedidasEstandar.get(20).getDesviaciones().getDes_3() - lstMedidasEstandar.get(20).getDesviaciones().getDes_3Neg()) * proporMax
            };
            
            List<MedidaDTO> listMedidas = new ArrayList<MedidaDTO>();

            double[] acumuladoSem = new double[30]; 
            int[] cantidadSem = new int[30]; 
            
            double[] acumuladoNac = new double[30]; 
            int[] cantidadNac = new int[30]; 
            
            long cantErroresNuevos = 0;
            for(Document medida : docMedidas){

                String codigo = medida.get("CODE").toString();
                
                Document docMedida = (Document) medida.get(tipoMedida);
                Document docAlimentacion = (Document) medida.get("alimentacion");
                
                if(docMedida.get("sem40") == null){//OJO  falta agregar los q no tienen semana 40
                    cantErroresNuevos++;
                    continue;  
                }

                String valorC = docMedida.get("sem40").toString();
                Double valC = Double.parseDouble(valorC);
                Double minC = arrMin1[16];
                Double maxC = arrMax1[16];
                Double c = (valC - minC)/(maxC - minC);

                boolean hayMenor40 = false;
                for(int i = 39; i>23 ; i--){

                    String nombreVariable = "sem" + i;

                    if(docMedida.get(nombreVariable) == null)
                        continue;
                    else{   
                        
                        acumuladoNac[i-24] += Double.parseDouble(docMedida.get(nombreVariable).toString());
                        cantidadNac[i-24]++;
                            
                        for(int k = i; k <= 39 ; k++){
                            hayMenor40 = true;
                            nombreVariable = "sem" + k;
                            String valor = docMedida.get(nombreVariable).toString();
                            Double valA = Double.parseDouble(valor);

                            Double maxA = arrMax1[k - 24];
                            Double minA = arrMin1[k - 24];

                            Double a  = (valA - minA)/(maxA - minA);

                            int j = k + 1;

                            Double maxB = arrMax1[j - 24];
                            Double minB = arrMin1[j - 24];

                            Double varB = maxB - minB;

                            int m = 40-j;//j - i;

                            Double valB = (a*m+c)/(m+1);      //((m * (varC - varA))/ (40 - i)) + varA;
                            Double b = (valB * varB) + minB;

                            docMedida.put("sem" + j, b);
                            acumuladoSem[j-24] += Double.parseDouble(docMedida.get("sem" + j).toString());
                            cantidadSem[j-24]++;
                        
                        }
                        
                        MedidaDTO medidaDto = CargarMedidas(docMedida, docAlimentacion, codigo);
                        listMedidas.add(medidaDto);
                        break;
                    }
                }
                
                if(!hayMenor40){
                    MedidaDTO medidaDto = CargarMedidas(docMedida, docAlimentacion, codigo);
                    listMedidas.add(medidaDto); 
                    
                    acumuladoNac[16] += Double.parseDouble(docMedida.get("sem40").toString());
                    cantidadNac[16]++;
                        
                }
                
                if(docMedida.get("sem40")!=null){
                    acumuladoSem[16] += Double.parseDouble(docMedida.get("sem40").toString());
                    cantidadSem[16]++;
                }
                if(docMedida.get("mes3")!=null){
                    acumuladoSem[17] += Double.parseDouble(docMedida.get("mes3").toString());
                    cantidadSem[17]++;
                }
                if(docMedida.get("mes6")!=null){
                    acumuladoSem[18] += Double.parseDouble(docMedida.get("mes6").toString());
                    cantidadSem[18]++;
                }
                if(docMedida.get("mes9")!=null){
                    acumuladoSem[19] += Double.parseDouble(docMedida.get("mes9").toString());
                    cantidadSem[19]++;
                }
                if(docMedida.get("mes12")!=null){
                    acumuladoSem[20] += Double.parseDouble(docMedida.get("mes12").toString());
                    cantidadSem[20]++;
                }
                
                    
            }

            
            List<MedidaDTO> listMedidasEstandar = new ArrayList<MedidaDTO>();
            
            Document medidaEstandar_3Neg = new Document();
            Document medidaEstandar_2Neg = new Document();
            Document medidaEstandar_1Neg = new Document();
            Document medidaEstandar_0 = new Document();
            Document medidaEstandar_1 = new Document();
            Document medidaEstandar_2 = new Document();
            Document medidaEstandar_3 = new Document();
            
            Document medidaPromedio_0 = new Document();//por semana
            Document medidaPromedioN_0 = new Document();//por nacimiento
            
            for(int i = 0; i < lstLabels.length; i++){
                medidaEstandar_3Neg.put(lstLabels[i],lstMedidasEstandar.get(i).getDesviaciones().getDes_3Neg());
                medidaEstandar_2Neg.put(lstLabels[i],lstMedidasEstandar.get(i).getDesviaciones().getDes_2Neg());
                medidaEstandar_1Neg.put(lstLabels[i],lstMedidasEstandar.get(i).getDesviaciones().getDes_1Neg());
                medidaEstandar_0.put(lstLabels[i],lstMedidasEstandar.get(i).getDesviaciones().getDes_0());
                medidaEstandar_1.put(lstLabels[i],lstMedidasEstandar.get(i).getDesviaciones().getDes_1());
                medidaEstandar_2.put(lstLabels[i],lstMedidasEstandar.get(i).getDesviaciones().getDes_2());
                medidaEstandar_3.put(lstLabels[i],lstMedidasEstandar.get(i).getDesviaciones().getDes_3());
                
                if(cantidadSem[i] != 0){
                    medidaPromedio_0.put(lstLabels[i],acumuladoSem[i]/cantidadSem[i]);
                    
                }
                
                if(cantidadNac[i] != 0){
                    medidaPromedioN_0.put(lstLabels[i],acumuladoNac[i]/cantidadNac[i]);
                    
                }
            }
            
            
            listMedidasEstandar.add(CargarMedidas(medidaEstandar_3Neg, null, "des_3Neg"));
            listMedidasEstandar.add(CargarMedidas(medidaEstandar_2Neg, null, "des_2Neg"));
            listMedidasEstandar.add(CargarMedidas(medidaEstandar_1Neg, null, "des_1Neg"));
            listMedidasEstandar.add(CargarMedidas(medidaEstandar_0, null, "des_0"));
            listMedidasEstandar.add(CargarMedidas(medidaEstandar_1, null, "des_1"));
            listMedidasEstandar.add(CargarMedidas(medidaEstandar_2, null, "des_2"));
            listMedidasEstandar.add(CargarMedidas(medidaEstandar_3, null, "des_3"));
            listMedidasEstandar.add(CargarMedidas(medidaPromedio_0, null, "avg_0"));
            listMedidasEstandar.add(CargarMedidas(medidaPromedioN_0, null, "avgN_0"));
            
            
            VectoresInicioDTO vectoresInicio = new VectoresInicioDTO();
            vectoresInicio.setCantidadErrores(cantErrores + cantErroresNuevos);
            vectoresInicio.setCantidadOutliers(cantOutliers);
            vectoresInicio.setCantidadRegistros(cantRegistros);
            vectoresInicio.setLimitesMinimos(arrMin1);
            vectoresInicio.setLimitesMaximos(arrMax1);
            vectoresInicio.setListaMedidas(listMedidas);
            vectoresInicio.setListaMedidasEstandar(listMedidasEstandar);
            
       
            
            return vectoresInicio;
    }
    
    private static MedidaDTO CargarMedidas(Document docMedida, Document docAlimentacion, String code){
        
        MedidaDTO medida = new MedidaDTO();
        medida.setCODE(code);
        
        medida.setSem24(docMedida.get("sem24") == null ? 0 : Double.parseDouble(docMedida.get("sem24").toString()));
        medida.setSem25(docMedida.get("sem25") == null ? 0 : Double.parseDouble(docMedida.get("sem25").toString()));
        medida.setSem26(docMedida.get("sem26") == null ? 0 : Double.parseDouble(docMedida.get("sem26").toString()));
        medida.setSem27(docMedida.get("sem27") == null ? 0 : Double.parseDouble(docMedida.get("sem27").toString()));
        medida.setSem28(docMedida.get("sem28") == null ? 0 : Double.parseDouble(docMedida.get("sem28").toString()));
        medida.setSem29(docMedida.get("sem29") == null ? 0 : Double.parseDouble(docMedida.get("sem29").toString()));
        medida.setSem30(docMedida.get("sem30") == null ? 0 : Double.parseDouble(docMedida.get("sem30").toString()));
        medida.setSem31(docMedida.get("sem31") == null ? 0 : Double.parseDouble(docMedida.get("sem31").toString()));
        medida.setSem32(docMedida.get("sem32") == null ? 0 : Double.parseDouble(docMedida.get("sem32").toString()));
        medida.setSem33(docMedida.get("sem33") == null ? 0 : Double.parseDouble(docMedida.get("sem33").toString()));
        medida.setSem34(docMedida.get("sem34") == null ? 0 : Double.parseDouble(docMedida.get("sem34").toString()));
        medida.setSem35(docMedida.get("sem35") == null ? 0 : Double.parseDouble(docMedida.get("sem35").toString()));
        medida.setSem36(docMedida.get("sem36") == null ? 0 : Double.parseDouble(docMedida.get("sem36").toString()));
        medida.setSem37(docMedida.get("sem37") == null ? 0 : Double.parseDouble(docMedida.get("sem37").toString()));
        medida.setSem38(docMedida.get("sem38") == null ? 0 : Double.parseDouble(docMedida.get("sem38").toString()));
        medida.setSem39(docMedida.get("sem39") == null ? 0 : Double.parseDouble(docMedida.get("sem39").toString()));
        medida.setSem40(docMedida.get("sem40") == null ? 0 : Double.parseDouble(docMedida.get("sem40").toString()));
        medida.setMes3(docMedida.get("mes3") == null ? 0 : Double.parseDouble(docMedida.get("mes3").toString()));
        medida.setMes6(docMedida.get("mes6") == null ? 0 : Double.parseDouble(docMedida.get("mes6").toString()));
        medida.setMes9(docMedida.get("mes9") == null ? 0 : Double.parseDouble(docMedida.get("mes9").toString()));
        medida.setMes12(docMedida.get("mes12") == null ? 0 : Double.parseDouble(docMedida.get("mes12").toString()));
        //alimentacion
        if(docAlimentacion != null){
            medida.setAlimentacion_sem40(docAlimentacion.get("sem40") == null ? "v" : docAlimentacion.get("sem40").toString());
            medida.setAlimentacion_mes3(docAlimentacion.get("mes3") == null ? "v" : docAlimentacion.get("mes3").toString());
            medida.setAlimentacion_mes6(docAlimentacion.get("mes6")== null ? "v" :docAlimentacion.get("mes6").toString());
            medida.setAlimentacion_mes9(docAlimentacion.get("mes9")== null ? "v" :docAlimentacion.get("mes9").toString());
            medida.setAlimentacion_mes12(docAlimentacion.get("mes12")== null ? "v" : docAlimentacion.get("mes12").toString());
        }
        
        return medida;
    }

    private static DesviacionDTO crearDesviacion(Document docDesviacion){
        
        DesviacionDTO desviacion = new DesviacionDTO();
        desviacion.setDes_3Neg(Double.parseDouble(docDesviacion.get("des_3Neg").toString()));
        desviacion.setDes_2Neg(Double.parseDouble(docDesviacion.get("des_2Neg").toString()));
        desviacion.setDes_1Neg(Double.parseDouble(docDesviacion.get("des_1Neg").toString()));
        desviacion.setDes_0(Double.parseDouble(docDesviacion.get("des_0").toString()));
        desviacion.setDes_1(Double.parseDouble(docDesviacion.get("des_1").toString()));
        desviacion.setDes_2(Double.parseDouble(docDesviacion.get("des_2").toString()));
        desviacion.setDes_3(Double.parseDouble(docDesviacion.get("des_3").toString()));
        return desviacion;
    }
   
    /**
     * Handles the HTTP <code>POST</code> method.
     *
     * @param request servlet request
     * @param response servlet response
     * @throws ServletException if a servlet-specific error occurs
     * @throws IOException if an I/O error occurs
     */
    @Override
    protected void doPost(HttpServletRequest request, HttpServletResponse response)
            throws ServletException, IOException {
        
        //String json = request.getInputStream();
        String json = IOUtils.toString(request.getInputStream(), "UTF-8");
        Gson gson = new Gson();
        
        VariableFilterMeasureDTO filters = gson.fromJson(json, VariableFilterMeasureDTO.class);
        //List<VariableFilterMeasureDTO> lstFilters = Arrays.asList(filters);
        
        response.setContentType("application/json;charset=UTF-8");
        try (PrintWriter out = response.getWriter()) {
            
            VectoresInicioDTO vectoresInicio = new VectoresInicioDTO();
            vectoresInicio = getMeasures(filters);
            
            Gson gsonResult = new Gson();
            out.println(gsonResult.toJson(vectoresInicio));
        }
    }

    /**
     * Returns a short description of the servlet.
     *
     * @return a String containing servlet description
     */
    @Override
    public String getServletInfo() {
        return "Short description";
    }

}
