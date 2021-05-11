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
public class FilterDTO {

    private String variablesGroup;
    private List<VariableFilterDTO> variablesFiltro;

    public String getVariablesGroup() {
        return variablesGroup;
    }

    public void setVariablesGroup(String variablesGroup) {
        this.variablesGroup = variablesGroup;
    }

    public List<VariableFilterDTO> getVariablesFiltro() {
        return variablesFiltro;
    }

    public void setVariablesFiltro(List<VariableFilterDTO> variablesFiltro) {
        this.variablesFiltro = variablesFiltro;
    }

   

}
