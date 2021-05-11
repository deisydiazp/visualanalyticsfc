/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package co.edu.uniandes.visualanalyticsfc;


import co.edu.uniandes.visualanalyticsfc.dto.GroupFiltersDTO;
import co.edu.uniandes.visualanalyticsfc.dto.CategoriesVariableDTO;
import co.edu.uniandes.visualanalyticsfc.dto.FilterDTO;
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
import java.util.List;
import java.util.ResourceBundle;
import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import jdk.nashorn.internal.ir.BreakNode;
import org.apache.commons.io.IOUtils;
import org.bson.Document;
import org.bson.conversions.Bson;


/**
 *
 * @author Deisy
 */
@WebServlet(name = "FilterBarGroupServlet", urlPatterns = {"/FilterBarGroupServlet"})
public class FilterBarGroupServlet extends HttpServlet {

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
        //List<VariableFilterDTO> lstFilters = Arrays.asList(filters);
        
        response.setContentType("application/json;charset=UTF-8");
        try (PrintWriter out = response.getWriter()) {
            
            List<GroupFiltersDTO> resultGroups  = getGeneralFilters(filters);
            
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
            cadMatch = "{'" + variable.getNameVariable() + "':'" + variable.getValuesFilters().get(0) + "'},";
        }
        
        return cadMatch;
    }
    
    private List<GroupFiltersDTO> getGeneralFilters(FilterDTO filter){
        
        String nameDB = ResourceBundle.getBundle("propiedades").getString("nameDB");
        String conexionDB = ResourceBundle.getBundle("propiedades").getString("conexionDB");
        MongoDatabase mongoDB = new MongoClient(new MongoClientURI(conexionDB)).getDatabase(nameDB); 
        
        MongoCollection collectionCrecimiento = mongoDB.getCollection("medidas_crecimiento");
        MongoCollection collectionVariables = mongoDB.getCollection("variables_filtro");
        
        List<Document> varGroup = (List<Document>) collectionVariables.find(new Document("grupo",filter.getVariablesGroup())).into(new ArrayList<Document>());
        
       
        
        String cadMatch = "";
        if(filter.getVariablesFiltro() != null){
            
            for(VariableFilterDTO var : filter.getVariablesFiltro()){

                cadMatch += getCadMatch(var);
            }

        }
        
        List<GroupFiltersDTO> resultGroups = new ArrayList<GroupFiltersDTO>();
        
      
        for(Document var : varGroup){    
            
            String cadMatchComplete = "{$and: [" + cadMatch + "{'" + var.get("variable").toString() + "':{$exists:true}}]}";

            cadMatchComplete = cadMatchComplete.replace(",}", "}");
            cadMatchComplete = cadMatchComplete.replace(",]", "]");
            
            System.out.println("**************** Servicio: FilterBarGroupServlet - " + filter.getVariablesGroup() + " ---->" + cadMatchComplete);
            Document docFilter = Document.parse(cadMatchComplete);

             Bson match = new Document("$match",docFilter);
            
            GroupFiltersDTO groupResult = new GroupFiltersDTO();
            groupResult.setNameVariable(var.get("variable").toString());
            groupResult.setGroup(var.get("grupo").toString());
            groupResult.setTypeGraph(var.get("tipoGrafico").toString());
            groupResult.setLabel(var.get("label").toString());
            
            List<CategoriesVariableDTO> lstCategories = new ArrayList<CategoriesVariableDTO>();
           
            String cadRange = "{    " +
            "    'range': { " +
            "       $concat: [ " +
            "          { $cond: [{$lt: ['$" + var.get("variable").toString() + "',60]}, '<60', '']}," +
            "          { $cond: [{$and:[ {$gte:['$" + var.get("variable").toString() + "', 60 ]}, {$lt: ['$" + var.get("variable").toString() + "', 70]}]}, '60-69', '']}," +
            "          { $cond: [{$and:[ {$gte:['$" + var.get("variable").toString() + "', 70 ]}, {$lt: ['$" + var.get("variable").toString() + "', 80]}]}, '70-79', '']}," +
            "          { $cond: [{$and:[ {$gte:['$" + var.get("variable").toString() + "', 80 ]}, {$lt: ['$" + var.get("variable").toString() + "', 90]}]}, '80-89', '']}," +
            "          { $cond: [{$and:[ {$gte:['$" + var.get("variable").toString() + "', 90 ]}, {$lt: ['$" + var.get("variable").toString() + "', 100]}]}, '90-99', '']}," +
            "          { $cond: [{$and:[ {$gte:['$" + var.get("variable").toString() + "',100]}, {$lt:['$" + var.get("variable").toString() + "', 110]}]}, '100-109', '']}," +
            "          { $cond: [{$and:[ {$gte:['$" + var.get("variable").toString() + "',110]}, {$lt:['$" + var.get("variable").toString() + "', 120]}]}, '110-119', '']}," +
            "          { $cond: [{$gt:['$" + var.get("variable").toString() + "',120]}, '>120', '']}" +
            "       ]" +
            "    }  " +
            "  }"; 
            //System.out.println("-----------------------------> Range" + cadRange);    
                
            Document docRange = Document.parse(cadRange);

            Bson range = new Document("$project",docRange);
            Bson group = new Document("$group", new Document("_id", "$range").append("cont", new Document("$sum",1)));

            AggregateIterable<Document> docGroups;
            docGroups = collectionCrecimiento.aggregate(Arrays.asList(match,range,group, new Document("$sort", new Document("_id",1))));
            
            List<Document> categories = (List<Document>) var.get("categories");
            int totalCont = 0;
            
            if(categories != null){
                for(Document category :categories){
                    //totalCont = 0;
                    for (Document doc : docGroups) {
                        
                        if((doc.get("_id").toString()).equals(category.get("label").toString())){
                            CategoriesVariableDTO groupDto = new CategoriesVariableDTO();
                            groupDto.setVariable(category.get("valorVariable").toString());
                            groupDto.setValue(doc.get("cont").toString());
                            groupDto.setLabelCorto(category.get("labelCorto").toString());
                            groupDto.setColor(category.get("color").toString());
                            groupDto.setLabel(category.get("label").toString());
                            lstCategories.add(groupDto);
                            
                            totalCont += Integer.parseInt(doc.get("cont").toString());
                            break;
                        }
                    }
                }
                
                for (CategoriesVariableDTO category : lstCategories) {
                    double porcentaje = (Double.parseDouble(category.getValue())/totalCont)*100;
                    category.setValue(String.valueOf(porcentaje));
                }
                
                groupResult.setVariablesCategories(lstCategories);
            }
            resultGroups.add(groupResult);
            
        }
        
        return resultGroups;
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
