/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package co.edu.uniandes.visualanalyticsfc;


import co.edu.uniandes.visualanalyticsfc.dto.UserDTO;
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
import org.bson.conversions.Bson;


/**
 *
 * @author Deisy
 */
@WebServlet(name = "UserServlet", urlPatterns = {"/UserServlet"})
public class UserServlet extends HttpServlet {

   
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

        UserDTO user = gson.fromJson(json, UserDTO.class);
        
        response.setContentType("application/json;charset=UTF-8");
        try (PrintWriter out = response.getWriter()) {
            
            
            
            if(user.getAccion().equals("consultarCorreo")){
                UserDTO resultValidacion = new UserDTO();
                resultValidacion  = consultarUsuarioCorreo(user);
                Gson gsonResult = new Gson();
                out.println(gsonResult.toJson(resultValidacion));
            }
            
            if(user.getAccion().equals("editar")){
                String resultValidacion = "";
                resultValidacion  = editarUsuario(user);
                Gson gsonResult = new Gson();
                out.println(gsonResult.toJson(resultValidacion));
            }
            
            if(user.getAccion().equals("crear")){
                String resultValidacion = "";
                resultValidacion  = crearUsuario(user);
                Gson gsonResult = new Gson();
                out.println(gsonResult.toJson(resultValidacion));
            }
            
            if(user.getAccion().equals("consultar")){
                List<UserDTO> resultValidacion;
                resultValidacion  = consultarUsuarios();
                Gson gsonResult = new Gson();
                out.println(gsonResult.toJson(resultValidacion));
            }
            
            if(user.getAccion().equals("eliminar")){
                List<UserDTO> resultValidacion;
                eliminarUsuario(user);
                resultValidacion  = consultarUsuarios();
                Gson gsonResult = new Gson();
                out.println(gsonResult.toJson(resultValidacion));
            }
            
        }
    }

    private UserDTO consultarUsuarioCorreo(UserDTO user){
     
        String nameDB = ResourceBundle.getBundle("propiedades").getString("nameDB");
        String conexionDB = ResourceBundle.getBundle("propiedades").getString("conexionDB");
        MongoDatabase mongoDB = new MongoClient(new MongoClientURI(conexionDB)).getDatabase(nameDB); 
        
        MongoCollection collectionUser = mongoDB.getCollection("usuarios");
      
        Document email = new Document("email", user.getEmailUsuario());
        List<Document> useBD = (List<Document>) collectionUser.find(email).into(new ArrayList<Document>());
  
        if(useBD.size()>0){
            UserDTO userFind = new UserDTO();
            for(Document doc : useBD){
                userFind.setNombreUsuario(doc.get("nombre").toString());
                userFind.setEmailUsuario(doc.get("email").toString());
                userFind.setDescripcionUsuario(doc.get("descripcion").toString());
                userFind.setAdministrador(Boolean.valueOf(doc.get("administrador").toString()));
            }
            return userFind;
        }
        else
            return null;
    }
    
    private String crearUsuario(UserDTO user){
     
        String nameDB = ResourceBundle.getBundle("propiedades").getString("nameDB");
        String conexionDB = ResourceBundle.getBundle("propiedades").getString("conexionDB");
        MongoDatabase mongoDB = new MongoClient(new MongoClientURI(conexionDB)).getDatabase(nameDB); 
        
        MongoCollection collectionUser = mongoDB.getCollection("usuarios");
        
        Document email = new Document("email", user.getEmailUsuario());
        List<Document> useBD = (List<Document>) collectionUser.find(email).into(new ArrayList<Document>());
        if(useBD.size()>0)
            return "NO se guardaron datos. El usuario ya se encuentra registrado";
       
        Document docUser = new Document();
        docUser.append("email", user.getEmailUsuario());
        docUser.append("nombre", user.getNombreUsuario());
        docUser.append("descripcion", user.getDescripcionUsuario());
        docUser.append("administrador", user.isAdministrador());        
        docUser.append("fechaCreacion", new Date());
        
        collectionUser.insertOne(docUser);
        
        return "OK";
    }
     
    private String editarUsuario(UserDTO user){
     
        String nameDB = ResourceBundle.getBundle("propiedades").getString("nameDB");
        String conexionDB = ResourceBundle.getBundle("propiedades").getString("conexionDB");
        MongoDatabase mongoDB = new MongoClient(new MongoClientURI(conexionDB)).getDatabase(nameDB); 
        
        MongoCollection collectionUser = mongoDB.getCollection("usuarios");
        
        Document email = new Document("email", user.getEmailUsuario());
        List<Document> useBD = (List<Document>) collectionUser.find(email).into(new ArrayList<Document>());
        //if(useBD.size()>1)
       //     return "NO se guardaron datos. El usuario ya se encuentra registrado";
       
        Document docUser = new Document();
        docUser.append("email", user.getEmailUsuario());
        docUser.append("nombre", user.getNombreUsuario());
        docUser.append("descripcion", user.getDescripcionUsuario());
        docUser.append("administrador", user.isAdministrador());        
        docUser.append("fechaCreacion", new Date());
        
        Bson updateDocument = new Document("$set", docUser);
        
        collectionUser.updateOne(email, updateDocument);
        
        return "OK";
    }
    
    private List<UserDTO> consultarUsuarios(){
     
        String nameDB = ResourceBundle.getBundle("propiedades").getString("nameDB");
        String conexionDB = ResourceBundle.getBundle("propiedades").getString("conexionDB");
        MongoDatabase mongoDB = new MongoClient(new MongoClientURI(conexionDB)).getDatabase(nameDB); 
        
        MongoCollection collectionUser = mongoDB.getCollection("usuarios");
        List<Document> lstUsers = (List<Document>) collectionUser.find().into(new ArrayList<Document>());
        
        List<UserDTO> users = new ArrayList<UserDTO>();
        for(Document doc : lstUsers){
            UserDTO user = new UserDTO();
            user.setNombreUsuario(doc.get("nombre").toString());
            user.setEmailUsuario(doc.get("email").toString());
            user.setDescripcionUsuario(doc.get("descripcion").toString());
            user.setAdministrador(Boolean.valueOf(doc.get("administrador").toString()));
            users.add(user);
        }
        
        return users;
    } 
    
     private void eliminarUsuario(UserDTO user){
     
        String nameDB = ResourceBundle.getBundle("propiedades").getString("nameDB");
        String conexionDB = ResourceBundle.getBundle("propiedades").getString("conexionDB");
        MongoDatabase mongoDB = new MongoClient(new MongoClientURI(conexionDB)).getDatabase(nameDB); 
        
        MongoCollection collectionUser = mongoDB.getCollection("usuarios");
      
        Document email = new Document("email", user.getEmailUsuario());
        collectionUser.deleteOne(email);
        
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
