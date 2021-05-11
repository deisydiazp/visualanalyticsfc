/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package co.edu.uniandes.visualanalyticsfc;

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
@WebServlet(name = "AverageMeasureServlet", urlPatterns = {"/AverageMeasureServlet"})
public class AverageMeasureServlet extends HttpServlet {

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

        VariableFilterMeasureDTO filters = gson.fromJson(json, VariableFilterMeasureDTO.class);

        response.setContentType("application/json;charset=UTF-8");
        try (PrintWriter out = response.getWriter()) {

            List<List<PromYearDTO>> resultGroups = getAverageAge(filters);

            Gson gsonResult = new Gson();
            out.println(gsonResult.toJson(resultGroups));
        }

    }

    private String getCadMatch(VariableFilterDTO variable) {

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

    private Map<String, PromYearDTO> lstPromAge = new HashMap<String, PromYearDTO>();
    private Map<String, PromYearDTO> lstPromYear = new HashMap<String, PromYearDTO>();

    private List<List<PromYearDTO>> getAverageAge(VariableFilterMeasureDTO filters) {

        String tipoMedida = filters.getMeasure();

        System.out.println("****************Inicio AverageAgeServlet");

        String nameDB = ResourceBundle.getBundle("propiedades").getString("nameDB");
        String conexionDB = ResourceBundle.getBundle("propiedades").getString("conexionDB");
        MongoDatabase mongoDB = new MongoClient(new MongoClientURI(conexionDB)).getDatabase(nameDB);

        MongoCollection collectionCrecimiento = mongoDB.getCollection("medidas_crecimiento");

        Bson group = new Document("$group", new Document("_id", "$ANOCAT"));
        Bson sort = new Document("$sort", new Document("_id", 1));
        AggregateIterable<Document> docYears = collectionCrecimiento.aggregate(Arrays.asList(group, sort));

        List<String> lstYears = new ArrayList<>();

        for (Document year : docYears) {            
            Object id = year.get("_id");
            if(id==null){
                continue;
            }
            lstYears.add(year.get("_id").toString());
        }

        String[] lstLabelsAge = {"sem24", "sem25", "sem26", "sem27", "sem28", "sem29", "sem30", "sem31", "sem32", "sem33", "sem34", "sem35", "sem36", "sem37", "sem38", "sem39", "sem40", "mes3", "mes6", "mes9", "mes12"};
        int[] lstGenero = {1, 2};

        String cadMatch = "";

        for (VariableFilterDTO var : filters.getFilters()) {

            if (var.getNameVariable().equals("ANOCAT")) {
                continue;
            }

            cadMatch += getCadMatch(var);
        }

        cadMatch += "{'" + tipoMedida + ".outlier':{$ne:true}},";
        cadMatch = cadMatch.replace(",}", "}");
        cadMatch = cadMatch.replace(",]", "]");

        String cadMatchComplete = "{$and: [" + cadMatch + "]}";

        cadMatchComplete = cadMatchComplete.replace(",}", "}");
        cadMatchComplete = cadMatchComplete.replace(",]", "]");

        System.out.println(cadMatchComplete);
        Document docFilter = Document.parse(cadMatchComplete);
        Bson match = new Document("$match", docFilter);
        AggregateIterable<Document> docPromedios = collectionCrecimiento.aggregate(Arrays.asList(
                match,
                new Document("$group", new Document("_id", new Document("$concat", Arrays.asList(new Document("$substr", Arrays.asList("$ANOCAT",0,4)),",",new Document("$substr", Arrays.asList("$sexo",0,1)))))
                        .append("sem24", new Document("$avg", "$" + tipoMedida + ".sem24"))
                        .append("sem25", new Document("$avg", "$" + tipoMedida + ".sem25"))
                        .append("sem26", new Document("$avg", "$" + tipoMedida + ".sem26"))
                        .append("sem27", new Document("$avg", "$" + tipoMedida + ".sem27"))
                        .append("sem28", new Document("$avg", "$" + tipoMedida + ".sem28"))
                        .append("sem29", new Document("$avg", "$" + tipoMedida + ".sem29"))
                        .append("sem30", new Document("$avg", "$" + tipoMedida + ".sem30"))
                        .append("sem31", new Document("$avg", "$" + tipoMedida + ".sem31"))
                        .append("sem32", new Document("$avg", "$" + tipoMedida + ".sem32"))
                        .append("sem33", new Document("$avg", "$" + tipoMedida + ".sem33"))
                        .append("sem34", new Document("$avg", "$" + tipoMedida + ".sem34"))
                        .append("sem35", new Document("$avg", "$" + tipoMedida + ".sem35"))
                        .append("sem36", new Document("$avg", "$" + tipoMedida + ".sem36"))
                        .append("sem37", new Document("$avg", "$" + tipoMedida + ".sem37"))
                        .append("sem38", new Document("$avg", "$" + tipoMedida + ".sem38"))
                        .append("sem39", new Document("$avg", "$" + tipoMedida + ".sem39"))
                        .append("sem40", new Document("$avg", "$" + tipoMedida + ".sem40"))
                        .append("mes3", new Document("$avg", "$" + tipoMedida + ".mes3"))
                        .append("mes6", new Document("$avg", "$" + tipoMedida + ".mes6"))
                        .append("mes9", new Document("$avg", "$" + tipoMedida + ".mes9"))
                        .append("mes12", new Document("$avg", "$" + tipoMedida + ".mes12")))
        ));
        Map<String, Document> mapa=new HashMap<>();
        for (Document prom : docPromedios) {
            mapa.put(prom.getString("_id"), prom);
        }
        for (String year : lstYears) {
            for (int genero : lstGenero) {
                PromYearDTO promAge = new PromYearDTO();
                promAge.setGender(String.valueOf(genero));
                promAge.setCODE(year);
                Document prom=mapa.get(year+","+genero);
                if(prom==null){
                    continue;
                }
                agregarYears(prom.get("sem24") == null ? 0 : (double) prom.get("sem24"), "sem24", genero, year);
                agregarYears(prom.get("sem25") == null ? 0 : (double) prom.get("sem25"), "sem25", genero, year);
                agregarYears(prom.get("sem26") == null ? 0 : (double) prom.get("sem26"), "sem26", genero, year);
                agregarYears(prom.get("sem27") == null ? 0 : (double) prom.get("sem27"), "sem27", genero, year);
                agregarYears(prom.get("sem28") == null ? 0 : (double) prom.get("sem28"), "sem28", genero, year);
                agregarYears(prom.get("sem29") == null ? 0 : (double) prom.get("sem29"), "sem29", genero, year);
                agregarYears(prom.get("sem30") == null ? 0 : (double) prom.get("sem30"), "sem30", genero, year);
                agregarYears(prom.get("sem31") == null ? 0 : (double) prom.get("sem31"), "sem31", genero, year);
                agregarYears(prom.get("sem32") == null ? 0 : (double) prom.get("sem32"), "sem32", genero, year);
                agregarYears(prom.get("sem33") == null ? 0 : (double) prom.get("sem33"), "sem33", genero, year);
                agregarYears(prom.get("sem34") == null ? 0 : (double) prom.get("sem34"), "sem34", genero, year);
                agregarYears(prom.get("sem35") == null ? 0 : (double) prom.get("sem35"), "sem35", genero, year);
                agregarYears(prom.get("sem36") == null ? 0 : (double) prom.get("sem36"), "sem36", genero, year);
                agregarYears(prom.get("sem37") == null ? 0 : (double) prom.get("sem37"), "sem37", genero, year);
                agregarYears(prom.get("sem38") == null ? 0 : (double) prom.get("sem38"), "sem38", genero, year);
                agregarYears(prom.get("sem39") == null ? 0 : (double) prom.get("sem39"), "sem39", genero, year);
                agregarYears(prom.get("sem40") == null ? 0 : (double) prom.get("sem40"), "sem40", genero, year);
                agregarYears(prom.get("mes3") == null ? 0 : (double) prom.get("mes3"), "mes3", genero, year);
                agregarYears(prom.get("mes6") == null ? 0 : (double) prom.get("mes6"), "mes6", genero, year);
                agregarYears(prom.get("mes9") == null ? 0 : (double) prom.get("mes9"), "mes9", genero, year);
                agregarYears(prom.get("mes12") == null ? 0 : (double) prom.get("mes12"), "mes12", genero, year);
            }
        }
        List<List<PromYearDTO>> lst = new ArrayList<>();
        lst.add(new ArrayList<>(lstPromAge.values()));
        lst.add(new ArrayList<>(lstPromYear.values()));
        return lst;
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

    private void agregarYears(double prom, String sem, int genero, String year) {
        if (lstPromYear.get(sem + genero) == null) {
            PromYearDTO dto = new PromYearDTO();
            dto.setCODE(sem);
            dto.setGender(String.valueOf(genero));
            dto.setLstProm(new HashMap<>());
            dto.getLstProm().put(year, prom);
            lstPromYear.put(sem + genero, dto);
        } else {
            PromYearDTO dto = lstPromYear.get(sem + genero);
            dto.getLstProm().put(year, prom);
        }

        if (lstPromAge.get(year + genero) == null) {
            PromYearDTO dto = new PromYearDTO();
            dto.setCODE(String.valueOf(year));
            dto.setGender(String.valueOf(genero));
            dto.setLstProm(new HashMap<>());
            dto.getLstProm().put(sem, prom);
            lstPromAge.put(year + genero, dto);
        } else {
            PromYearDTO dto = lstPromAge.get(year + genero);
            dto.getLstProm().put(sem, prom);
        }
    }

}
