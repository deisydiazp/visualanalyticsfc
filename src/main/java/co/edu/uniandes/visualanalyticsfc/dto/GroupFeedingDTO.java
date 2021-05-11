/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package co.edu.uniandes.visualanalyticsfc.dto;

import java.util.List;

/**
 *
 * @author Deisy
 */
public class GroupFeedingDTO {

    private String year;
    private List<GroupEdadFeedingDTO> edades;

    public String getYear() {
        return year;
    }

    public void setYear(String year) {
        this.year = year;
    }

    public List<GroupEdadFeedingDTO> getEdades() {
        return edades;
    }

    public void setEdades(List<GroupEdadFeedingDTO> edades) {
        this.edades = edades;
    }

   
   

}
