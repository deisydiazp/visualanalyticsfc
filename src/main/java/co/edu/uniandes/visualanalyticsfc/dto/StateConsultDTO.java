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
public class StateConsultDTO {
    
    private String id;
    private String nameState;
    private String descriptionState;
    private List<VariableFilterDTO> variablesFilter;
    private String dateCreate;

    public String getDateCreate() {
        return dateCreate;
    }

    public void setDateCreate(String dateCreate) {
        this.dateCreate = dateCreate;
    }
    
    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public String getNameState() {
        return nameState;
    }

    public void setNameState(String nameState) {
        this.nameState = nameState;
    }

    public String getDescriptionState() {
        return descriptionState;
    }

    public void setDescriptionState(String descriptionState) {
        this.descriptionState = descriptionState;
    }

    public List<VariableFilterDTO> getVariablesFilter() {
        return variablesFilter;
    }

    public void setVariablesFilter(List<VariableFilterDTO> variablesFilter) {
        this.variablesFilter = variablesFilter;
    }
  
}
