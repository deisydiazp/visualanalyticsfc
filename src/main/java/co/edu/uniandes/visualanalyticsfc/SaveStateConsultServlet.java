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
import java.util.ArrayList;
import java.util.Date;
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
@WebServlet(name = "SaveStateConsultServlet", urlPatterns = {"/SaveStateConsultServlet"})
public class SaveStateConsultServlet extends HttpServlet {

   
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

        StateConsultDTO stateConsult = gson.fromJson(json, StateConsultDTO.class);
        
        response.setContentType("application/json;charset=UTF-8");
        try (PrintWriter out = response.getWriter()) {
            
            String resultGroups  = saveStateConsult(stateConsult);
            
            Gson gsonResult = new Gson();
            out.println(gsonResult.toJson(resultGroups));
        }
    }

    private String saveStateConsult(StateConsultDTO stateConsult){
     
        String nameDB = ResourceBundle.getBundle("propiedades").getString("nameDB");
        String conexionDB = ResourceBundle.getBundle("propiedades").getString("conexionDB");
        MongoDatabase mongoDB = new MongoClient(new MongoClientURI(conexionDB)).getDatabase(nameDB); 
        
        MongoCollection collectionState = mongoDB.getCollection("estado_consulta");
      
        Document docState = new Document();
        docState.append("nameState", stateConsult.getNameState());
        docState.append("descriptionState", stateConsult.getDescriptionState());
                
        List<Document> lstVariables = new ArrayList<Document>();
       
        List<VariableFilterDTO> variablesFilter = stateConsult.getVariablesFilter();
        for(int i = 0; i< variablesFilter.size(); i++){
            Document docVariable = new Document();
            docVariable.append("labelVariable", variablesFilter.get(i).getLabelVariable());
            docVariable.append("nameVariable", variablesFilter.get(i).getNameVariable());
            docVariable.append("valuesFilter", variablesFilter.get(i).getValuesFilters());
            docVariable.append("labelsFilter", variablesFilter.get(i).getValuesLabels());
            docVariable.append("typeFilter", variablesFilter.get(i).getTypeFilter());
            lstVariables.add(docVariable);
        }  
        docState.append("filters",lstVariables); 
        docState.append("dateCreate", new Date());
        
        collectionState.insertOne(docState);
        
        return "Los datos se han guardado satisfactoriamente.";
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
