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
public class GroupEdadFeedingDTO {

    private String edad;
    private List<CategoriesVariableDTO> feeding;

    public String getEdad() {
        return edad;
    }

    public void setEdad(String edad) {
        this.edad = edad;
    }

   public List<CategoriesVariableDTO> getFeeding() {
        return feeding;
    }

    public void setFeeding(List<CategoriesVariableDTO> feeding) {
        this.feeding = feeding;
    }

}
