/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package co.edu.uniandes.visualanalyticsfc.segridad;

import java.io.IOException;
import java.io.PrintStream;
import java.io.PrintWriter;
import java.io.StringWriter;
import javax.servlet.Filter;
import javax.servlet.FilterChain;
import javax.servlet.FilterConfig;
import javax.servlet.ServletException;
import javax.servlet.ServletRequest;
import javax.servlet.ServletResponse;
import javax.servlet.annotation.WebFilter;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

/**
 *
 * @author Deisy
 */
@WebFilter(filterName = "FiltroCache", urlPatterns = {"/*"})
public class FiltroCache implements Filter {
    
    // The filter configuration object we are associated with.  If
    // this value is null, this filter instance is not currently
    // configured. 
    private FilterConfig filterConfig = null;
    
    public FiltroCache() {
    }    
    
    /**
     *
     * @param request The servlet request we are processing
     * @param response The servlet response we are creating
     * @param chain The filter chain we are processing
     *
     * @exception IOException if an input/output error occurs
     * @exception ServletException if a servlet error occurs
     */
    public void doFilter(ServletRequest request, ServletResponse response,
            FilterChain chain)
            throws IOException, ServletException {
        //excluir los archivos que se descargan
        if(((HttpServletRequest)request).getRequestURI().endsWith(".pdf")
                ||((HttpServletRequest)request).getRequestURI().endsWith(".txt")
                ||((HttpServletRequest)request).getRequestURI().endsWith(".cvs")
                ||((HttpServletRequest)request).getRequestURI().contains("/js/lib/")){
            chain.doFilter(request, response);
            return;
        }
        
        //incluir encabezados para cache
        ((HttpServletResponse)response).addHeader("cache-control", "max-age=0");
        ((HttpServletResponse)response).addHeader("cache-control", "no-cache");
        ((HttpServletResponse)response).addHeader("expires", "0");
        ((HttpServletResponse)response).addHeader("expires", "Tue, 01 Jan 1980 1:00:00 GMT");
        ((HttpServletResponse)response).addHeader("pragma", "no-cache");
        
        chain.doFilter(request, response);
        
    }

    /**
     * Return the filter configuration object for this filter.
     */
    public FilterConfig getFilterConfig() {
        return (this.filterConfig);
    }

    /**
     * Set the filter configuration object for this filter.
     *
     * @param filterConfig The filter configuration object
     */
    public void setFilterConfig(FilterConfig filterConfig) {
        this.filterConfig = filterConfig;
    }

    /**
     * Destroy method for this filter
     */
    public void destroy() {        
    }

    /**
     * Init method for this filter
     */
    public void init(FilterConfig filterConfig) {        
        this.filterConfig = filterConfig;
    }
    
}
