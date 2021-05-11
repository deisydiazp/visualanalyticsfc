/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package co.edu.uniandes.visualanalyticsfc;

import co.edu.uniandes.visualanalyticsfc.dto.FilterDTO;
import co.edu.uniandes.visualanalyticsfc.dto.StackedAgeDTO;
import co.edu.uniandes.visualanalyticsfc.dto.StackedGenderDTO;
import co.edu.uniandes.visualanalyticsfc.dto.StackedGroupDTO;
import co.edu.uniandes.visualanalyticsfc.dto.StackedRciuDTO;
import co.edu.uniandes.visualanalyticsfc.dto.VariableFilterDTO;
import com.google.gson.Gson;
import com.mongodb.MongoClient;
import com.mongodb.MongoClientURI;
import com.mongodb.client.AggregateIterable;
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
import org.bson.conversions.Bson;


/**
 *
 * @author Deisy
 */
@WebServlet(name = "FilterStackedServlet", urlPatterns = {"/FilterStackedServlet"})
public class FilterStackedServlet extends HttpServlet {

    private String[] CATEGORIAS_RCIU={"1","0"};
    
    
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

        FilterDTO filters = gson.fromJson(json, FilterDTO.class);
        /*VariableFilterDTO[] filters = gson.fromJson(json, VariableFilterDTO[].class);
        List<VariableFilterDTO> lstFilters = Arrays.asList(filters);*/
        
        response.setContentType("application/json;charset=UTF-8");
        try (PrintWriter out = response.getWriter()) {
            
            List<StackedGroupDTO> resultGroups  = getGeneralFiltersStacked(filters);
            
            Gson gsonResult = new Gson();
            out.println(gsonResult.toJson(resultGroups));
        }
    }

    
    private String getCadMatch(VariableFilterDTO variable){
        
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
                    cadMatch += "{'percapitasalariominimo' : {$gte: 1, $lt: 2}},";
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
            cadMatch = "{'" + variable.getNameVariable() + "':" + variable.getValuesFilters().get(0) + "},";
        }
        
        return cadMatch;
    }
    
    private List<StackedGroupDTO> getGeneralFiltersStacked(FilterDTO filter){
        
        System.out.println("****************Inicio filterStackedServlet");
        
        String nameDB = ResourceBundle.getBundle("propiedades").getString("nameDB");
        String conexionDB = ResourceBundle.getBundle("propiedades").getString("conexionDB");
        MongoDatabase mongoDB = new MongoClient(new MongoClientURI(conexionDB)).getDatabase(nameDB); 
                
        MongoCollection collectionCrecimiento = mongoDB.getCollection("medidas_crecimiento");
        MongoCollection collectionVariables = mongoDB.getCollection("variables_filtro");
        
        List<Document> variablesGenero = (List<Document>) collectionVariables.find(new Document("variable","sexo")).into(new ArrayList<Document>());
        List<Document> categoriesGenero = (List<Document>) variablesGenero.get(0).get("categories");
        
        //List<Document> variablesRCIU = (List<Document>) collectionVariables.find(new Document("variable","RCIUpesoFenton")).into(new ArrayList<Document>());
        List<Document> variablesRCIU = (List<Document>) collectionVariables.find(new Document("variable",filter.getVariablesGroup())).into(new ArrayList<Document>());
        
        List<Document> categoriesRCIU = (List<Document>) variablesRCIU.get(0).get("categories");
        
      
        List<String> lstGenero = new ArrayList<>();
        lstGenero.add("1");
        lstGenero.add("2");
        
        List<String> lstSemanaGestacion = new ArrayList<>();
        lstSemanaGestacion.add("24");
        lstSemanaGestacion.add("25");
        lstSemanaGestacion.add("26");
        lstSemanaGestacion.add("27");
        lstSemanaGestacion.add("28");
        lstSemanaGestacion.add("29");
        lstSemanaGestacion.add("30");
        lstSemanaGestacion.add("31");
        lstSemanaGestacion.add("32");
        lstSemanaGestacion.add("33");
        lstSemanaGestacion.add("34");
        lstSemanaGestacion.add("35");
        lstSemanaGestacion.add("36");
        lstSemanaGestacion.add("37");
        lstSemanaGestacion.add("38");
        lstSemanaGestacion.add("39");
        lstSemanaGestacion.add("40");

        String cadMatch = "";
        for(VariableFilterDTO var : filter.getVariablesFiltro()){
            
            if(var.getNameVariable().equals("sexo")){
                lstGenero = var.getValuesFilters();
            }
            
            if(var.getNameVariable().equals("edadgestacional")){
                lstSemanaGestacion = var.getValuesFilters();
            }        
            cadMatch += getCadMatch(var);
        }
        
        List<StackedGroupDTO> lstGroup = new ArrayList<StackedGroupDTO>();

        cadMatch = cadMatch.replace(",}", "}");
        cadMatch = cadMatch.replace(",]", "]");


        String cadMatchComplete = "{$and: [" + cadMatch + "]}";

        cadMatchComplete = cadMatchComplete.replace(",}", "}");
        cadMatchComplete = cadMatchComplete.replace(",]", "]");
                
        System.out.println("*************************Stacked  " + cadMatchComplete);
        Document docMatch = Document.parse(cadMatchComplete);
        Bson match = new Document("$match",docMatch);
                
        Bson group = new Document("$group", 
                new Document("_id", 
                        new Document("$concat", 
                                Arrays.asList(
                                        //new Document("$substr", Arrays.asList("$RCIUpesoFenton",0,1)),",",
                                        new Document("$substr", Arrays.asList("$"+filter.getVariablesGroup(),0,1)),",",
                                        new Document("$substr", Arrays.asList("$edadgestacional",0,2)),",",
                                        new Document("$substr", Arrays.asList("$sexo",0,1)))))
                .append("cont", new Document("$sum",1)));
                
        AggregateIterable<Document> docGroups = collectionCrecimiento.aggregate(Arrays.asList(match,group));
        Map<String, Document> map=new HashMap<>();
        for(Document doc:docGroups){
            map.put(doc.getString("_id"), doc);
        }
        
        for(String genero: lstGenero){
            StackedGenderDTO StackedGender = new StackedGenderDTO();
            for(Document doc: categoriesGenero){
                if(genero.equals(doc.get("valorVariable").toString())){
                    StackedGender.setColor(doc.get("color").toString());
                    StackedGender.setVariable(doc.get("label").toString());
                    break;
                }
            }
            StackedGroupDTO StackedGroup = new StackedGroupDTO();
            StackedGroup.setGender(StackedGender);
            
            List<StackedAgeDTO> lstAge = new ArrayList<>();
            
            for (String semana: lstSemanaGestacion){
                StackedAgeDTO StackedAge = new StackedAgeDTO();
                StackedAge.setVariable("sem" + semana);
                
                List<StackedRciuDTO> lstStackedRciu = new ArrayList<>();
                for(String categoria:CATEGORIAS_RCIU){    
                    for(Document docRciu: categoriesRCIU){
                        if(categoria.compareTo(docRciu.getString("valorVariable"))!=0)continue;
                        StackedRciuDTO rciu0 = new StackedRciuDTO();
                        rciu0.setColor(docRciu.get("color").toString());
                        rciu0.setVariable(docRciu.get("label").toString());
                        if(map.get(""+docRciu.get("valorVariable")+","+semana+","+genero)==null){
                            continue;
                        }
                        rciu0.setValueAbsolute(map.get(""+docRciu.get("valorVariable")+","+semana+","+genero).getInteger("cont"));
                        lstStackedRciu.add(rciu0);
                    }
                }
                StackedAge.setValue(lstStackedRciu);
                lstAge.add(StackedAge);
            }
            StackedGroup.setAge(lstAge);
            
            lstGroup.add(StackedGroup);
        }

        return lstGroup;
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
