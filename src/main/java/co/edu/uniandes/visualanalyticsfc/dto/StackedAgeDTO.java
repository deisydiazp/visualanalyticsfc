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
public class StackedAgeDTO {

    private String variable;
    private List<StackedRciuDTO> value;

    public String getVariable() {
        return variable;
    }

    public void setVariable(String variable) {
        this.variable = variable;
    }

    public List<StackedRciuDTO> getValue() {
        return value;
    }

    public void setValue(List<StackedRciuDTO> value) {
        this.value = value;
    }

    
    
    

}
