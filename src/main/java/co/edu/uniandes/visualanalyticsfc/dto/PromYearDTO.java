/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package co.edu.uniandes.visualanalyticsfc.dto;

import java.util.Map;

/**
 *
 * @author Deisy
 */
public class PromYearDTO {
    
    private String gender;
    private String CODE;
    private Map<String, Double> lstProm;
     

    public String getGender() {
        return gender;
    }

    public void setGender(String gender) {
        this.gender = gender;
    }
    
    public String getCODE() {
        return CODE;
    }

    public void setCODE(String CODE) {
        this.CODE = CODE;
    }

    public Map<String, Double> getLstProm() {
        return lstProm;
    }

    public void setLstProm(Map<String, Double> lstProm) {
        this.lstProm = lstProm;
    }

    
}
