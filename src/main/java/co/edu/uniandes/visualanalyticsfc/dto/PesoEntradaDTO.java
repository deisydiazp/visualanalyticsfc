/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package co.edu.uniandes.visualanalyticsfc.dto;

/**
 *
 * @author danie
 */
public class PesoEntradaDTO {
    
    private Integer gender;
    private Integer CODE;
    private Double pesoNacer;
    private Double pesoEntradaPMC;
    private Double pesoSem40;

    public Integer getGender() {
        return gender;
    }

    public void setGender(Integer gender) {
        this.gender = gender;
    }

    public Integer getCODE() {
        return CODE;
    }

    public void setCODE(Integer CODE) {
        this.CODE = CODE;
    }

    public Double getPesoNacer() {
        return pesoNacer;
    }

    public void setPesoNacer(Double pesoNacer) {
        this.pesoNacer = pesoNacer;
    }

    public Double getPesoEntradaPMC() {
        return pesoEntradaPMC;
    }

    public void setPesoEntradaPMC(Double pesoEntradaPMC) {
        this.pesoEntradaPMC = pesoEntradaPMC;
    }

    public Double getPesoSem40() {
        return pesoSem40;
    }

    public void setPesoSem40(Double pesoSem40) {
        this.pesoSem40 = pesoSem40;
    }
    
}
