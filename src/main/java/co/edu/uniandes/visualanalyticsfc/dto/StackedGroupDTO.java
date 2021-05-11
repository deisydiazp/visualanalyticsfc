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
public class StackedGroupDTO {

    private StackedGenderDTO gender;
    private List<StackedAgeDTO> age;

    public StackedGenderDTO getGender() {
        return gender;
    }

    public void setGender(StackedGenderDTO gender) {
        this.gender = gender;
    }

    public List<StackedAgeDTO> getAge() {
        return age;
    }

    public void setAge(List<StackedAgeDTO> age) {
        this.age = age;
    }

   

}
