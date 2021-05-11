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
public class VariableFilterMeasureDTO {

    
    private int gender;
    private boolean outlier;
    private String measure;
    List<VariableFilterDTO> filters;

    public String getMeasure() {
        return measure;
    }

    public void setMeasure(String measure) {
        this.measure = measure;
    }

    public int getGender() {
        return gender;
    }

    public void setGender(int gender) {
        this.gender = gender;
    }

    public boolean isOutlier() {
        return outlier;
    }

    public void setOutlier(boolean outlier) {
        this.outlier = outlier;
    }

    public List<VariableFilterDTO> getFilters() {
        return filters;
    }

    public void setFilters(List<VariableFilterDTO> filters) {
        this.filters = filters;
    }
  
}
