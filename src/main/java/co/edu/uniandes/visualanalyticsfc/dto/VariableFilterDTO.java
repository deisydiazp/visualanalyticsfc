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
public class VariableFilterDTO {
    
    private String labelVariable;
    private String nameVariable;
    private List<String> valuesFilters;
    private List<String> valuesLabels;
    private String typeFilter;
    

    public List<String> getValuesLabels() {
        return valuesLabels;
    }

    public void setValuesLabels(List<String> valuesLabels) {
        this.valuesLabels = valuesLabels;
    }

    public String getLabelVariable() {
        return labelVariable;
    }

    public void setLabelVariable(String labelVariable) {
        this.labelVariable = labelVariable;
    }

    public String getNameVariable() {
        return nameVariable;
    }

    public void setNameVariable(String nameVariable) {
        this.nameVariable = nameVariable;
    }

    public String getTypeFilter() {
        return typeFilter;
    }

    public void setTypeFilter(String typeFilter) {
        this.typeFilter = typeFilter;
    }

    public List<String> getValuesFilters() {
        return valuesFilters;
    }

    public void setValuesFilters(List<String> valuesFilters) {
        this.valuesFilters = valuesFilters;
    }

    

}
