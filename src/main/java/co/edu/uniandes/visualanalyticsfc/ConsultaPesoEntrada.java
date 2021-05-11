/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package co.edu.uniandes.visualanalyticsfc;

import co.edu.uniandes.visualanalyticsfc.dto.PromYearDTO;
import co.edu.uniandes.visualanalyticsfc.dto.VariableFilterDTO;
import com.google.gson.Gson;
import com.mongodb.MongoClient;
import com.mongodb.MongoClientURI;
import com.mongodb.client.MapReduceIterable;
import com.mongodb.client.MongoCollection;
import com.mongodb.client.MongoDatabase;
import java.io.IOException;
import java.io.PrintWriter;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.ResourceBundle;
import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import org.apache.commons.io.IOUtils;
import org.bson.Document;

/**
 *
 * @author Deisy
 */
@WebServlet(name = "ConsultaPesoEntrada", urlPatterns = {"/ConsultaPesoEntrada"})
public class ConsultaPesoEntrada extends HttpServlet {

    public static final String[] lstLabels = {"sem24", "sem25", "sem26", "sem27", "sem28", "sem29", "sem30", "sem31", "sem32", "sem33",
        "sem34", "sem35", "sem36", "sem37", "sem38", "sem39", "sem40",
        "mes3", "mes6", "mes9", "mes12"};

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

    private static String getCadMatch(VariableFilterDTO variable) {

        String cadMatch = "";

        if (variable.getNameVariable().equals("percapitasalariominimo")) {
            cadMatch = "{$or:[";
            for (String range : variable.getValuesFilters()) {
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
        
        if (variable.getTypeFilter().equals("range")) {
            cadMatch = "{'" + variable.getNameVariable() + "':{$gte:" + variable.getValuesFilters().get(0) + ", $lte:" + variable.getValuesFilters().get(1) + "}},";
        }
        if (variable.getTypeFilter().equals("or")) {
            cadMatch = "{$or:[";
            for (String value : variable.getValuesFilters()) {
                /*if (value.equals("")) {
                    value = "''";
                }*/
                cadMatch += "{'" + variable.getNameVariable() + "':" + value + "},";
            }
            cadMatch += "]},";
        }

        if (variable.getTypeFilter().equals("none")) {
            cadMatch = "{'" + variable.getNameVariable() + "':'" + variable.getValuesFilters().get(0) + "'},";
        }

        return cadMatch;
    }

    //private static int ano = 1993;
    private List<PromYearDTO> ProcesarMedidas(List<VariableFilterDTO> filters) {

        String nameDB = ResourceBundle.getBundle("propiedades").getString("nameDB");
        String conexionDB = ResourceBundle.getBundle("propiedades").getString("conexionDB");
        MongoDatabase mongoDB = new MongoClient(new MongoClientURI(conexionDB)).getDatabase(nameDB);
        MongoCollection collectionMedidasCrecimiento = mongoDB.getCollection("medidas_crecimiento");

        String cadMatch = "";
        for (VariableFilterDTO var : filters) {
            if(var.getValuesFilters()!=null && !var.getValuesFilters().isEmpty()){
                cadMatch += getCadMatch(var);
            }
        }

        String cadenaMatchFiltros = "{$and: [" + cadMatch + "]}";
        cadenaMatchFiltros = cadenaMatchFiltros.replace(",}", "}");
        cadenaMatchFiltros = cadenaMatchFiltros.replace(",]", "]");

        //**********De acuerdo a los filtros seleccionados se obtienen las tendencias correspondientes 
        Document docFilter = Document.parse(cadenaMatchFiltros);

        String map = "function() {\n"
                + "    if(this.pesoalnacer_Normalizado){\n"
                + "        emit(this.ANOCAT+'-'+this.sexo+'-1', this.pesoalnacer_Normalizado);\n"
                + "    }\n"
                + "    if(this.pesoalaentrada_Normalizado){\n"
                + "        emit(this.ANOCAT+'-'+this.sexo+'-2', this.pesoalaentrada_Normalizado);\n"
                + "    }\n"
                + "    if(this.peso_normalizado && this.peso_normalizado.sem40){\n"
                + "        emit(this.ANOCAT+'-'+this.sexo+'-3', this.peso_normalizado.sem40);\n"
                + "    }\n"
                + "}";

        String reduce = "function(keyCustId, values) {\n"
                + "    var sum=0.0;\n"
                + "    var count=0;\n"
                + "    values.forEach(function (value){\n"
                + "        sum+=value;\n"
                + "        count++;\n"
                + "    });\n"
                + "    return sum/count;\n"
                + "}";

        MapReduceIterable<Document> docMedidas = collectionMedidasCrecimiento.mapReduce(map, reduce,Document.class).filter(docFilter);
        List<PromYearDTO> lstPromYear = new ArrayList<>();
        Map<String, PromYearDTO> mapa = new HashMap<>();
        
        for (Document resultado : docMedidas) {
            String[] id = ((String) resultado.get("_id")).split("\\-");
            Double value = (Double) resultado.get("value");
            PromYearDTO dto;
            if (mapa.get(id[0] + id[1]) != null) {
                dto = mapa.get(id[0] + id[1]);
            } else {
                dto = new PromYearDTO();
                dto.setCODE(id[0]);
                dto.setGender(id[1]);
                dto.setLstProm(new HashMap<>());
                mapa.put(dto.getCODE() + dto.getGender(), dto);
                lstPromYear.add(dto);
            }
            String medida;
            switch (id[2]) {
                case "1":
                    medida="pesoNacer";
                    break;
                case "2":
                    medida="pesoEntrada";
                    break;
                case "3":
                    medida="pesoSem40";
                    break;
                default:
                    medida="";
            }
            dto.getLstProm().put(medida, value);
        }
        
        return lstPromYear;
    }
    
    private List<PromYearDTO> ProcesarMedidasDetalle(List<VariableFilterDTO> filters) {

        String nameDB = ResourceBundle.getBundle("propiedades").getString("nameDB");
        String conexionDB = ResourceBundle.getBundle("propiedades").getString("conexionDB");
        MongoDatabase mongoDB = new MongoClient(new MongoClientURI(conexionDB)).getDatabase(nameDB);
        MongoCollection collectionMedidasCrecimiento = mongoDB.getCollection("medidas_crecimiento");

        String cadMatch = "";
        for (VariableFilterDTO var : filters) {
            if(var.getValuesFilters()!=null && !var.getValuesFilters().isEmpty()){
                cadMatch += getCadMatch(var);
            }
        }

        String cadenaMatchFiltros = "{$and: [" + cadMatch + "]}";
        cadenaMatchFiltros = cadenaMatchFiltros.replace(",}", "}");
        cadenaMatchFiltros = cadenaMatchFiltros.replace(",]", "]");

        //**********De acuerdo a los filtros seleccionados se obtienen las tendencias correspondientes 
        Document docFilter = Document.parse(cadenaMatchFiltros);

        List<Document> docMedidas = (List<Document>) collectionMedidasCrecimiento.find(docFilter).into(new ArrayList<Document>());
    
        List<PromYearDTO> lstPromYear = new ArrayList<>();
       
        //-----------------------------------------------------------------------//
        for(Document doc:docMedidas){
            try{
                PromYearDTO dto=new PromYearDTO();
                dto.setGender(doc.get("sexo").toString());
                dto.setCODE(doc.get("CODE").toString());
                
                Map<String, Double> mapa=new HashMap<>();
                mapa.put("pesoNacer", convertirD(doc.get("pesoalnacer_Normalizado")));
                mapa.put("pesoEntrada", convertirD(doc.get("pesoalaentrada_Normalizado")));
                
                Document nsem40=doc.get("peso_normalizado",Document.class);

                mapa.put("pesoSem40", convertirD(nsem40.get("sem40")));
                dto.setLstProm(mapa);
                
               
                lstPromYear.add(dto);
            }catch(Exception e){
                //System.out.println("doc error: "+e);
            }
        }
        return lstPromYear;
    }

    private Integer convertir(Object o) {
        return (o == null ? 0 : Integer.parseInt(o.toString()));
    }

    private Double convertirD(Object o) {
        return (o == null ? null : Double.parseDouble(o.toString()));
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

        VariableFilterDTO[] filters = gson.fromJson(json, VariableFilterDTO[].class);
        System.out.println("json: "+json);
        List<VariableFilterDTO> lstFilters = Arrays.asList(filters);

        response.setContentType("application/json;charset=UTF-8");
        try (PrintWriter out = response.getWriter()) {
            List<PromYearDTO> respuesta;
            if(request.getQueryString()!=null && request.getQueryString().contains("resumen")){
                respuesta = ProcesarMedidas(lstFilters);
            }else{
                respuesta = ProcesarMedidasDetalle(lstFilters);
            }
            Gson gsonResult = new Gson();
            out.println(gsonResult.toJson(respuesta));
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
