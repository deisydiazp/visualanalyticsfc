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
public class GroupFiltersDTO {

    private String nameVariable;
    private String label;
    private String group;
    private String typeGraph;
    private List<CategoriesVariableDTO> categories;

    public String getLabel() {
        return label;
    }

    public void setLabel(String label) {
        this.label = label;
    }

    public String getTypeGraph() {
        return typeGraph;
    }

    public void setTypeGraph(String typeGraph) {
        this.typeGraph = typeGraph;
    }

    public String getGroup() {
        return group;
    }

    public void setGroup(String group) {
        this.group = group;
    }

    public List<CategoriesVariableDTO> getCategories() {
        return categories;
    }

    public void setCategories(List<CategoriesVariableDTO> categories) {
        this.categories = categories;
    }

    public List<CategoriesVariableDTO> getVariablesCategories() {
        return categories;
    }

    public void setVariablesCategories(List<CategoriesVariableDTO> categories) {
        this.categories = categories;
    }

    public String getNameVariable() {
        return nameVariable;
    }

    public void setNameVariable(String nameVariable) {
        this.nameVariable = nameVariable;
    }
 
    
}
