/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */


function registrarUsuario(){
    
    var formObj = {};
    
    formObj['nombreUsuario'] = $('#nombreUsuario').val();
    formObj['emailUsuario'] = $('#emailUsuario').val();
    formObj['descripcionUsuario'] = $('#descripcionUsuario').val();
    formObj['administrador'] = $('#chAdministrador')[0].checked;
    formObj['accion'] = 'crear';
    
    $.post("UserServlet", JSON.stringify(formObj), function(data){

        if(data != "OK")
            mostrarMensaje(data,'alert alert-warning','divMensaje');
        else{
            mostrarMensaje('El usuario se ha registrado satisfactoriamente.','alert alert-success','divMensaje');
        }
    
        cargarUsuarios();
        limpiarFormulario();
    });
}

function editarUsuario(){
    
    var formObj = {};
    
    formObj['nombreUsuario'] = $('#nombreUsuario').val();
    formObj['emailUsuario'] = $('#emailUsuario').val();
    formObj['descripcionUsuario'] = $('#descripcionUsuario').val();
    formObj['administrador'] = $('#chAdministrador')[0].checked;
    formObj['accion'] = 'editar';
    
    $.post("UserServlet", JSON.stringify(formObj), function(data){

        if(data != "OK")
            mostrarMensaje(data,'alert alert-warning','divMensaje');
        else{
            mostrarMensaje('El usuario se ha actualizado satisfactoriamente.','alert alert-success','divMensaje');
        }
    
        cargarUsuarios();
        limpiarFormulario();
    });
}

function limpiarFormulario(){
    $('#nombreUsuario').val('');
    $('#emailUsuario').val('');
    $('#emailUsuario').prop('readonly', false);
    $('#descripcionUsuario').val('');
    $('#chAdministrador').prop('checked', false);
    
    $('#btnGuardar').css('display', 'block');
    $('#btnEditar').css('display', 'none');
        
}

function onSignIn(googleUser) {
    var profile = googleUser.getBasicProfile();

    var formObj = {};
    formObj['emailUsuario'] = profile.getEmail();
    formObj['accion'] = 'consultarCorreo';
    
    
    $.post("UserServlet", JSON.stringify(formObj), function(data){
        
        if(data != null){
            document.cookie='idToken='+googleUser.getAuthResponse().id_token;
                        
            $('#liAcceder')[0].style.display = "none";
            $('#liCerrarSession')[0].style.display = "block";
            $('#usuarioLogueado').text('Bienvenido ' + profile.getName());
            
            if(data.administrador==true)
                $('#liUsuarios')[0].style.display = "block";
            else
                $('#liUsuarios')[0].style.display = "none";
        
        }
        else{
            signOut(2);
            alert('Usuario no autorizado');
        }
    });
}

function signOut(formaCerrar) {
    //GoogleAuth.signOut();
    var auth2 = gapi.auth2.getAuthInstance();
    auth2.signOut().then(function () {
        $('#liAcceder')[0].style.display = "block";
        $('#liCerrarSession')[0].style.display = "none";
        
        $.get("logout", function(data){
            $('#content').attr('src','welcome.html');
            if(formaCerrar == 1)
                alert('Sesi\xf3n cerrada correctamente');
        });
        
        ocultarMensaje('divMensaje');
        document.cookie='';
    });
}

function mostrarMensaje(mensaje, estiloMensaje, idDiv) {

    var div = $('#'+idDiv);
    div.empty();
   
    var spanTag = document.createElement('span');
    if (estiloMensaje == "alert alert-success") {
        spanTag.className = "glyphicon glyphicon-ok";
    }
    else if (estiloMensaje == "alert alert-danger") {
        spanTag.className = "glyphicon glyphicon-ban-circle";
    }
    else if (estiloMensaje == "alert alert-warning") {
        spanTag.className = "glyphicon glyphicon-warning-sign";
    }
    div[0].appendChild(spanTag);  
    div[0].append("  " + mensaje);

    div[0].style.display = "block";
    div[0].className = estiloMensaje + " alert-dismissable";
    $(".alert").alert();

}

function ocultarMensaje(idDiv){
    $('#'+idDiv)[0].style.display = "none";
    //$('#'+idDiv)[0].empty();
    $('#usuarioLogueado').text('');
}

function cargarUsuarios(){
 
    var formObj = {};
    formObj['accion'] = 'consultar';
    
    $.post("UserServlet", JSON.stringify(formObj), function(data){
        
        crearTablaUsuarios(data);
  
    });
    
}

function eliminarUsuario(email){
 
    var formObj = {};
    formObj['emailUsuario'] = email;
    formObj['accion'] = 'eliminar';
    
    $.post("UserServlet", JSON.stringify(formObj), function(data){
        crearTablaUsuarios(data);
        mostrarMensaje('El usuario se ha eliminado satisfactoriamente.','alert alert-success','divMensaje');
    });
}

function cargarUsuarioEditar(email){
 
    var formObj = {};
    formObj['emailUsuario'] = email;
    formObj['accion'] = 'consultarCorreo';
    
    $.post("UserServlet", JSON.stringify(formObj), function(data){
        $('#nombreUsuario').val(data.nombreUsuario);
        $('#emailUsuario').val(data.emailUsuario);
        $('#emailUsuario').prop('readonly', true);
        $('#descripcionUsuario').val(data.descripcionUsuario);
        $('#chAdministrador').prop('checked', data.administrador);
    
        $('#btnGuardar')[0].style.display = "none";
        $('#btnEditar')[0].style.display = "block"
        
        cargarUsuarios();
    });
    
}

function crearTablaUsuarios(data){
    
    var esAdmin = 'si';
    
    var cadTabla = "<table class='table table-bordered'>";
        cadTabla += "<thead>";
        cadTabla += "<tr>";
        cadTabla += "<th style='width:25%'>Nombre</th>";
        cadTabla += "<th style='width:25%'>Correo</th>";
        cadTabla += "<th style='width:30%'>Descripci\u00F3n</th>";
        cadTabla += "<th style='width:10%'>Admin</th>";
        cadTabla += "<th style='width:5%'>Editar</th>";
        cadTabla += "<th style='width:5%'>Eliminar</th>";
        cadTabla += "</tr>";
        cadTabla += "</thead>";
        cadTabla += "<tbody>";
       
        for(var i = 0; i<data.length; i++){
            if(!data[i].administrador)
                esAdmin='no'
            else
                esAdmin='si'
            
            cadTabla += "<tr>";
            cadTabla += "<td>" + data[i].nombreUsuario + "</td>";
            cadTabla += "<td>" + data[i].emailUsuario + "</td>";
            cadTabla += "<td>" + data[i].descripcionUsuario + "</td>";
            cadTabla += "<td>" + esAdmin + "</td>";
            cadTabla += "<td>" + '<a href="javascript:cargarUsuarioEditar(\'' + data[i].emailUsuario + '\')"><i class="fa fa-edit pull-right"></i></a>' + "</td>";
            cadTabla += "<td>" + '<a href="javascript:eliminarUsuario(\'' + data[i].emailUsuario + '\')"><i class="fa fa-remove pull-right"></i></a>' + "</td>";
            cadTabla += "</tr>";
        }
        
        cadTabla += "</tbody>";
        cadTabla += "</table>";
        
        $( "#divTablaUsuarios").html(cadTabla); 
}


