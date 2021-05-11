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
public class StackedRciuDTO {

    private String variable;
    private String color;
    private int valueAbsolute;

    public int getValueAbsolute() {
        return valueAbsolute;
    }

    public void setValueAbsolute(int valueAbsolute) {
        this.valueAbsolute = valueAbsolute;
    }

    public String getVariable() {
        return variable;
    }

    public void setVariable(String variable) {
        this.variable = variable;
    }

    public String getColor() {
        return color;
    }

    public void setColor(String color) {
        this.color = color;
    }
    
    

}
