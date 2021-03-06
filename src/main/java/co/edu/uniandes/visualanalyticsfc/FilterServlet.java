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
@WebServlet(name = "FilterServlet", urlPatterns = {"/FilterServlet"})
public class FilterServlet extends HttpServlet {

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
        
        Bson match = null;
        
        if(filter.getVariablesFiltro() != null){
            String cadMatch = "";
            for(VariableFilterDTO var : filter.getVariablesFiltro()){

                cadMatch += getCadMatch(var);
            }

            String cadMatchComplete = "{$and: [" + cadMatch + "]}";

            cadMatchComplete = cadMatchComplete.replace(",}", "}");
            cadMatchComplete = cadMatchComplete.replace(",]", "]");
            
            System.out.println("**************** Servicio: FilterServlet - " + filter.getVariablesGroup() + " ---->" + cadMatchComplete);
            Document docFilter = Document.parse(cadMatchComplete);

            match = new Document("$match",docFilter);
        }
        
        
        List<GroupFiltersDTO> resultGroups = new ArrayList<GroupFiltersDTO>();
        
        //varGroup.parallelStream().forEach(var->{
        for(Document var : varGroup){    
            Bson group = new Document("$group", new Document("_id", "$"+var.get("variable").toString())
                                            .append("cont", new Document("$sum",1))
                                            );
        
            
            AggregateIterable<Document> docGroups;
           
            if(match != null)
                docGroups = collectionCrecimiento.aggregate(Arrays.asList(match,group, new Document("$sort", new Document("_id",1))));
            else
                docGroups = collectionCrecimiento.aggregate(Arrays.asList(group, new Document("$sort", new Document("_id",1))));
            
            GroupFiltersDTO groupResult = new GroupFiltersDTO();
            groupResult.setNameVariable(var.get("variable").toString());
            groupResult.setGroup(var.get("grupo").toString());
            groupResult.setTypeGraph(var.get("tipoGrafico").toString());
            groupResult.setLabel(var.get("label").toString());
            
            List<CategoriesVariableDTO> lstCategories = new ArrayList<CategoriesVariableDTO>();
            List<Document> categories = (List<Document>) var.get("categories");
            if(categories != null){
                for(Document category :categories){
                    CategoriesVariableDTO groupDto = new CategoriesVariableDTO();
                    groupDto.setVariable(category.get("valorVariable").toString());
                    groupDto.setValue("0");
                    groupDto.setLabelCorto(category.get("labelCorto").toString());
                    groupDto.setColor(category.get("color").toString());
                    groupDto.setLabel(category.get("label").toString());
                    
                    if (category.get("valorVariable").equals("") &&  var.get("contarVacios").toString().equals("false"))
                        continue;
                    else 
                        lstCategories.add(groupDto);
                    //groupDto.setValue(doc.get("cont").toString());
                }
            }
            
            
            for (Document doc : docGroups) {
                
                if (doc.get("_id") == null)
                    continue;
                
                CategoriesVariableDTO groupDto = new CategoriesVariableDTO();
                
                if(categories != null){
                    for(CategoriesVariableDTO category :lstCategories){
                        if((doc.get("_id").toString()).equals(category.getVariable())){
                            category.setValue(doc.get("cont").toString());
                            break;
                        }
                    }
                }else{
                    groupDto.setVariable(doc.get("_id").toString());
                    groupDto.setLabel(doc.get("_id").toString());
                    groupDto.setValue(doc.get("cont").toString());
                    lstCategories.add(groupDto);
                }
                
            }
            groupResult.setVariablesCategories(lstCategories);
            resultGroups.add(groupResult);
        }
        //});
        
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
