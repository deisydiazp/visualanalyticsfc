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
public class DesviacionPorMedidaDTO {
    
    private String medida;
    private DesviacionDTO desviaciones;

    public String getMedida() {
        return medida;
    }

    public void setMedida(String medida) {
        this.medida = medida;
    }

    public DesviacionDTO getDesviaciones() {
        return desviaciones;
    }

    public void setDesviaciones(DesviacionDTO desviaciones) {
        this.desviaciones = desviaciones;
    }

    
}