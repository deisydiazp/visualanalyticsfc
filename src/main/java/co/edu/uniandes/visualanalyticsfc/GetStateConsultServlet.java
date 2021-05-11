/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package co.edu.uniandes.visualanalyticsfc;


import co.edu.uniandes.visualanalyticsfc.dto.StateConsultDTO;
import co.edu.uniandes.visualanalyticsfc.dto.VariableFilterDTO;
import com.google.gson.Gson;
import com.mongodb.MongoClient;
import com.mongodb.MongoClientURI;
import com.mongodb.client.MongoCollection;
import com.mongodb.client.MongoDatabase;
import java.io.IOException;
import java.io.PrintWriter;
import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.List;
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
@WebServlet(name = "GetStateConsultServlet", urlPatterns = {"/GetStateConsultServlet"})
public class GetStateConsultServlet extends HttpServlet {

   
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

        String idStateConsult = gson.fromJson(json, String.class);
        
        response.setContentType("application/json;charset=UTF-8");
        try (PrintWriter out = response.getWriter()) {
            
            List<StateConsultDTO> resultStates  = getStateConsult(idStateConsult);
            
            Gson gsonResult = new Gson();
            out.println(gsonResult.toJson(resultStates));
        }
    }

    private List<StateConsultDTO> getStateConsult(String idStateConsult){
     
        String nameDB = ResourceBundle.getBundle("propiedades").getString("nameDB");
        String conexionDB = ResourceBundle.getBundle("propiedades").getString("conexionDB");
        MongoDatabase mongoDB = new MongoClient(new MongoClientURI(conexionDB)).getDatabase(nameDB); 
        
        MongoCollection collectionState = mongoDB.getCollection("estado_consulta");
      
        List<Document> docsStateConsult = new ArrayList<Document>();
        if(idStateConsult.equals("none")){
            docsStateConsult = (List<Document>) collectionState.find().sort(new Document("dateCreate",-1)).into(new ArrayList<Document>());
        } else{
            Document idState = new Document("_id", new org.bson.types.ObjectId(idStateConsult));
            docsStateConsult = (List<Document>) collectionState.find(idState).sort(new Document("dateCreate",-1)).into(new ArrayList<Document>());
        }
        
        List<StateConsultDTO> lstStateConsult = new ArrayList<StateConsultDTO>();
        for(Document docState: docsStateConsult){
            StateConsultDTO stateConsult = new StateConsultDTO();
            stateConsult.setId(docState.get("_id").toString());
            stateConsult.setNameState(docState.get("nameState").toString());
            stateConsult.setDescriptionState(docState.get("descriptionState").toString());
            
            List<Document> docsFilters = (List<Document>) docState.get("filters");
            List<VariableFilterDTO> variablesFilter = new ArrayList<VariableFilterDTO>();
            for(Document filter : docsFilters){
                VariableFilterDTO varibleFilter = new VariableFilterDTO();
                varibleFilter.setNameVariable(filter.get("nameVariable").toString());
                varibleFilter.setLabelVariable(filter.get("labelVariable").toString());
                varibleFilter.setTypeFilter(filter.get("typeFilter").toString());
                varibleFilter.setValuesFilters((ArrayList<String>) filter.get("valuesFilter"));
                varibleFilter.setValuesLabels((ArrayList<String>) filter.get("labelsFilter"));
                variablesFilter.add(varibleFilter);
            }
            
            SimpleDateFormat dt = new SimpleDateFormat("dd/MM/yyyy");
            stateConsult.setDateCreate(dt.format(docState.get("dateCreate")).toString());
            stateConsult.setVariablesFilter(variablesFilter);
            lstStateConsult.add(stateConsult);
        }
        
        return lstStateConsult;
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
