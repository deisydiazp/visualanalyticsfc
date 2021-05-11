/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package co.edu.uniandes.visualanalyticsfc;


import co.edu.uniandes.visualanalyticsfc.dto.CategoriesVariableDTO;
import co.edu.uniandes.visualanalyticsfc.dto.GroupEdadFeedingDTO;
import co.edu.uniandes.visualanalyticsfc.dto.GroupFeedingDTO;
import co.edu.uniandes.visualanalyticsfc.dto.PromYearDTO;
import co.edu.uniandes.visualanalyticsfc.dto.VariableFilterDTO;
import co.edu.uniandes.visualanalyticsfc.dto.VariableFilterMeasureDTO;
import com.google.gson.Gson;
import com.mongodb.MongoClient;
import com.mongodb.MongoClientURI;
import com.mongodb.client.AggregateIterable;
import com.mongodb.client.MongoCollection;
import com.mongodb.client.MongoDatabase;
import java.io.IOException;
import java.io.PrintWriter;
import java.util.AbstractMap;
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
@WebServlet(name = "ResumeFeedingServlet", urlPatterns = {"/ResumeFeedingServlet"})
public class ResumeFeedingServlet extends HttpServlet {

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
        
        VariableFilterDTO[] filters = gson.fromJson(json, VariableFilterDTO[].class);
        List<VariableFilterDTO> lstFilters = Arrays.asList(filters);
        
        response.setContentType("application/json;charset=UTF-8");
        try (PrintWriter out = response.getWriter()) {
            
            List<GroupFeedingDTO> resultGroups  = getAverageAge(lstFilters);
            
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

    private List<GroupFeedingDTO> getAverageAge(List<VariableFilterDTO> filters){
        
        System.out.println("****************Inicio ResumenMeasureServlet");
        
        String nameDB = ResourceBundle.getBundle("propiedades").getString("nameDB");
        String conexionDB = ResourceBundle.getBundle("propiedades").getString("conexionDB");
        MongoDatabase mongoDB = new MongoClient(new MongoClientURI(conexionDB)).getDatabase(nameDB); 
                
        MongoCollection collectionCrecimiento = mongoDB.getCollection("medidas_crecimiento");
        MongoCollection collectionVariables = mongoDB.getCollection("variables_filtro");
        
        List<Document> variablesAlimentacion = (List<Document>) collectionVariables.find(new Document("variable","alimentacion.sem40")).into(new ArrayList<Document>());
        List<Document> categories = (List<Document>) variablesAlimentacion.get(0).get("categories");
        
        Bson group = new Document("$group", new Document("_id", "$ANOCAT"));
        Bson sort = new Document("$sort",new Document("_id",1));
        AggregateIterable<Document> docYears = collectionCrecimiento.aggregate(Arrays.asList(group,sort));
        
        List<String> lstYears = new ArrayList<>();
         
         for (Document year : docYears) {            
            Object id = year.get("_id");
            if(id==null){
                continue;
            }
            lstYears.add(year.get("_id").toString());
        }
        
        //for (Document year : docYears) {
        //    lstYears.add(year.get("_id").toString());
        //}
        
        String[] lstLabelsAge = { "sem40", "mes3","mes6","mes9","mes12"};
               
        String cadMatch = "";
       
        for(VariableFilterDTO var : filters){
            if(var.getNameVariable().equals("ANOCAT"))
                continue;
            cadMatch += getCadMatch(var);
        }
        
        String cadMatchComplete = "{$and: [" + cadMatch + "]}";

        cadMatchComplete = cadMatchComplete.replace(",}", "}");
        cadMatchComplete = cadMatchComplete.replace(",]", "]");

        System.out.println("**"+cadMatchComplete);
        Document docFilter = Document.parse(cadMatchComplete);
        Bson match = new Document("$match",docFilter);
        
        Map<String,Document> mapa=new HashMap<>();
        
        for(String labelEdad:lstLabelsAge){
            AggregateIterable<Document> docFeeding = collectionCrecimiento.aggregate(Arrays.asList(
                match,
                new Document("$group", new Document("_id", new Document("$concat", Arrays.asList(new Document("$substr", Arrays.asList("$ANOCAT",0,4)),",",new Document("$substr", Arrays.asList("$alimentacion."+labelEdad,0,1)))))
                        //_id:{$concat:['$ANOCAT',',',{ "$substr": ["$alimentacion.sem40",0,1]}]},
                    .append("cont", new Document("$sum", 1))
            ),sort));
            
            for (Document doc : docFeeding) {
                mapa.put(labelEdad+","+doc.getString("_id"), doc);
            
            }
        }
        
        List<GroupFeedingDTO> lstFeedingDto = new ArrayList<>();
        for(String year: lstYears){
            GroupFeedingDTO groupFeedingDto = new GroupFeedingDTO();
            groupFeedingDto.setYear(String.valueOf(year));
            
            List<GroupEdadFeedingDTO> edades = new ArrayList<>();
            for(String labelEdad:lstLabelsAge){
                GroupEdadFeedingDTO edad = new GroupEdadFeedingDTO();
                edad.setEdad(labelEdad);
                
                List<CategoriesVariableDTO> lstCategories = new ArrayList<>();
                for(Document category :categories){
                    CategoriesVariableDTO groupDto = new CategoriesVariableDTO();
                    String valorCategoria=category.get("valorVariable").toString();
                    
                    if(valorCategoria.equals(""))
                        continue;
                    
                    groupDto.setVariable(valorCategoria);
                    if(mapa.get(labelEdad+","+year+","+valorCategoria)!=null){
                        groupDto.setValue(mapa.get(labelEdad+","+year+","+valorCategoria).get("cont").toString());
                    }else{
                        groupDto.setValue("0");
                    }
                    groupDto.setColor(category.get("color").toString());
                    groupDto.setLabel(category.get("label").toString());
                    groupDto.setLabelCorto(category.get("labelCorto").toString());
                    lstCategories.add(groupDto);
                }
                edad.setFeeding(lstCategories);
                edades.add(edad);
            }
            
            groupFeedingDto.setEdades(edades);
            lstFeedingDto.add(groupFeedingDto);
        }
        return lstFeedingDto;
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
