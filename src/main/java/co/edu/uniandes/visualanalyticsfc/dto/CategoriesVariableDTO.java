/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package co.edu.uniandes.visualanalyticsfc.dto;

/**
 *
 * @author Deisy
 */
public class CategoriesVariableDTO {
    
    private String variable;
    private String value;
    private String color;
    private String label;
    private String labelCorto;

    public String getLabelCorto() {
        return labelCorto;
    }

    public void setLabelCorto(String labelCorto) {
        this.labelCorto = labelCorto;
    }

    public String getLabel() {
        return label;
    }

    public void setLabel(String label) {
        this.label = label;
    }

    public String getColor() {
        return color;
    }

    public void setColor(String color) {
        this.color = color;
    }

    public String getVariable() {
        return variable;
    }

    public void setVariable(String variable) {
        this.variable = variable;
    }

    public String getValue() {
        return value;
    }

    public void setValue(String value) {
        this.value = value;
    }

}
