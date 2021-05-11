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
public class VectoresInicioDTO {
    
    long cantidadErrores;
    long cantidadOutliers;
    long cantidadRegistros;
    private double[] limitesMaximos;
    private double[]  limitesMinimos;
    private List<MedidaDTO> listaMedidas;
    private List<MedidaDTO> listaMedidasEstandar;

    public List<MedidaDTO> getListaMedidasEstandar() {
        return listaMedidasEstandar;
    }

    public void setListaMedidasEstandar(List<MedidaDTO> listaMedidasEstandar) {
        this.listaMedidasEstandar = listaMedidasEstandar;
    }

    public long getCantidadRegistros() {
        return cantidadRegistros;
    }

    public void setCantidadRegistros(long cantidadRegistros) {
        this.cantidadRegistros = cantidadRegistros;
    }

    public long getCantidadOutliers() {
        return cantidadOutliers;
    }

    public void setCantidadOutliers(long cantidadOutliers) {
        this.cantidadOutliers = cantidadOutliers;
    }

    public long getCantidadErrores() {
        return cantidadErrores;
    }

    public void setCantidadErrores(long cantidadErrores) {
        this.cantidadErrores = cantidadErrores;
    }

    public double[] getLimitesMaximos() {
        return limitesMaximos;
    }

    public void setLimitesMaximos(double[] limitesMaximos) {
        this.limitesMaximos = limitesMaximos;
    }

    public double[] getLimitesMinimos() {
        return limitesMinimos;
    }

    public void setLimitesMinimos(double[] limitesMinimos) {
        this.limitesMinimos = limitesMinimos;
    }

    public List<MedidaDTO> getListaMedidas() {
        return listaMedidas;
    }

    public void setListaMedidas(List<MedidaDTO> listaMedidas) {
        this.listaMedidas = listaMedidas;
    }
    
    
}
