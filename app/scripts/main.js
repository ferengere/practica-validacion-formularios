'use strict';
$.validator.setDefaults({
    submitHandler: function(form) {
        //a ejecutar antes de realizar el envío del formulario
        //pedir confirmación de la cuota a ser cargada, según forma de pago elegida
        var opcion = $('#inputFormaPago option:selected').val();
        var cuota = 0;
        //console.log('formapago: ' + opcion);
        switch (opcion) {
            case '1': //mensual
                cuota = 50;
                break;
            case '3': //trimestral
                cuota = 140;
                break;
            case '12': //anual
                cuota = 550;
                break;
        }
        //console.log('cuota: ' + cuota);

        $('#myModal .modal-body p').html('');
        $('#myModal .modal-body').append('<p>Se va a proceder a darle de alta.</p>');
        $('#myModal .modal-body').append('<p>Se le cobrará una primera cuota de ' + cuota + '€.</p>');
        $('#myModal .modal-body').append('<p class="text-warning"><small>Pulse Aceptar si está conforme.</small></p>');
        $('#myModal').modal({
            backdrop: 'static',
            keyboard: false
        }).one('click', function(event) {
            var button = $(event.target);
            //console.log(button);

            if (button.is('#aceptar')) {
                console.log('aceptar');
                form.submit();
            }
        });
    }
});


$('#formulario').validate({
    onkeyup: false,
    onfocusout: false,
    onclick: false,
    //onchange: false,
    //reglas de validación para todos los campos
    rules: {

        //Información de contacto
        inputNombre: {
            required: true,
            lettersonly: true
        },
        inputApellidos: {
            required: true,
            lettersonly: true
        },
        inputTelefono: {
            required: true,
            digits: true,
            minlength: 9,
            maxlength: 9
        },
        inputEmail1: {
            required: true,
            email: true,
            remote: function() {
                return 'php/validar_email_db.php';
            }
        },
        inputEmail2: {
            equalTo: inputEmail1
        },
        //Datos de facturación
        inputDemandante: {
            required: true
        },
        inputCifNif: {
            required: true,
            nifES: function() {
                if ($('#inputDemandante').val() === 'p') {
                    return true;
                }
            },
            cifES: function() {
                if ($('#inputDemandante').val() === 'e') {
                    return true;
                }
            },
            remote: function() {
                return 'php/validar_nif_db.php';
            }
        },
        inputNombreEmpresa: {
            required: true
        },
        inputDireccion: {
            required: true
        },
        inputCp: {
            required: true,
            digits: true,
            maxlength: 5
        },
        inputLocalidad: {
            required: true
        },
        inputProvincia: {
            required: true
        },
        inputPais: {
            required: true
        },
        inputIban: {
            required: true,
            iban: true,
            remote: function() {
                return 'php/validar_iban_db.php';
            }
        },
        inputFormaPago: {
            required: true
        },
        //Datos de acceso
        inputUsuario: {
            required: true,
            minlength: 4,
            remote: function() {
                return 'php/validar_usuario_db.php';
            }
        },
        inputContrasenna1: {
            required: true,
            complex: true
        },
        inputContrasenna2: {
            equalTo: inputContrasenna1
        }
    },
    messages: {
        //Información de contacto
        inputNombre: {
            required: 'Debe escribir su nombre',
            lettersonly: 'Debe escribir sólo letras'
        },
        inputApellidos: {
            required: 'Debe escribir sus apellidos',
            lettersonly: 'Debe escribir sólo letras'
        },
        inputTelefono: {
            required: 'Debe escribir su teléfono',
            digits: 'Debe escribir dígitos',
            minlength: jQuery.validator.format('La longitud debe ser {0}'),
            maxlength: jQuery.validator.format('La longitud debe ser {0}')
        },
        inputEmail1: {
            required: 'Debe escribir su email',
            email: 'Debe escribir un email válido',
            remote: 'Ese email ya existe'
        },
        inputEmail2: {
            equalTo: 'Los dos campos email deben coincidir'
        },
        inputCifNif: {
            required: 'Debe escribir el identificador fiscal',
            nifES: 'Debe escribir un nif válido',
            cifES: 'Debe escribir un cif válido',
            remote: 'Ese identificador ya existe'
        },
        inputNombreEmpresa: {
            required: 'Debe escribir el nombre'
        },
        inputDireccion: {
            required: 'Debe escribir la dirección'
        },
        inputCp: {
            required: 'Debe escribir el código postal',
            digits: 'Debe escribir sólo dígitos',
            maxlength: jQuery.validator.format('La longitud máxima es {0}')
        },
        inputLocalidad: {
            required: 'Debe escribir la localidad'
        },
        inputProvincia: {
            required: 'Debe escribir la provincia'
        },
        inputPais: {
            required: 'Debe escribir el país'
        },
        inputIban: {
            required: 'Debe escribir su IBAN',
            iban: 'El IBAN debe ser válido',
            remote: 'Ese iban ya existe'
        },
        inputFormaPago: {
            required: 'Debe elegir la forma de pago'
        },
        //Datos de acceso
        inputUsuario: {
            required: 'Debe escribir su nombre de usuario',
            minlength: jQuery.validator.format('El tamaño debe ser mínimo {0} caracteres'),
            remote: 'Ese usuario ya existe'
        },
        inputContrasenna1: {
            required: 'Debe escribir la contraseña',
            complex: 'La contraseña debe ser compleja'
        },
        inputContrasenna2: {
            equalTo: 'Los dos campos de contraseña deben coincidir'
        }
    }
});

//Ajustar campos y datos según es particular o empresa
//
var rellenaNombreEmpresa = function() {
    //console.log('dem: ' + $('#inputDemandante').val());
    if ($('#inputDemandante').val() === 'p') {
        var text = $('#inputNombre').val() + ' ' + $('#inputApellidos').val();
        $('#inputNombreEmpresa').val(text);
    }
};

//Al cambiar nombre o apellido, rellenar el nombe de datos de empresa
$('#inputNombre').on('change', rellenaNombreEmpresa);
$('#inputApellidos').on('change', rellenaNombreEmpresa);

//al cambiar el tipo de demandante, cambiar cif/nif, particular/empresa, nombre empresa/particular
$('#inputDemandante').on('change', function() {
    //console.log($("#inputDemandante option:selected").text());
    $('#inputCifNif').val('');
    $('#inputCifNif-error').text('');
    if ($(this).val() === 'p') {
        $('#lblCifNif').text('NIF *');
        $('#lblNombreEmpresa').text('Nombre *');
        rellenaNombreEmpresa();
    } else {
        $('#lblCifNif').text('CIF *');
        $('#lblNombreEmpresa').text('Empresa *');
        $('#inputNombreEmpresa').val('');
    }
});
//
//Ajustar campos y datos según es particular o empresa

//Código postal
//
//completar el código postal y buscar localidad y provincia
var buscarMunicipio = function(cp) {
    //var res = 'php/buscar_municipio_db.php?cp=' + cp;
    //console.log(res);
    $.ajax({
        'type': 'POST',
        //"url": 'php/buscar_municipio_db.php?cp=' + cp,
        'url': 'php/buscar_municipio_db.php',
        'data': {
            inputCp: cp
        },
        'dataType': 'json'
    }).done(function(data) {
        //console.log('AJAX ejecutado correctamente');
        if (data === null) {
            console.log('no se encuentra el cp');
            $('#inputProvincia').val('');
            $('#inputLocalidad').val('');
            $('#inputPais').val('');
        } else {
            console.log(data[0]);
            $('#inputProvincia').val(data[0].provincia);
            $('#inputProvincia-error').text('');
            $('#inputLocalidad').val(data[0].municipio);
            $('#inputLocalidad-error').text('');
            $('#inputPais').val('España');
            $('#inputPais-error').text('');
        }
    }).fail(function(err) {
        console.log('AJAX no se ha ejecutado correctamente: ' + err);
    });
};


$('#inputCp').on('change', function() {
    var cpAnt = $(this).val();
    var len = $(this).val().length;
    var cpPos = '';
    //console.log(len + ' ' + cpAnt);

    if (len < 5) {
        for (var i = 0; i < 5 - len; i++) {
            cpPos += '0';
        }
    }
    $(this).val(cpPos + cpAnt);

    //buscar localidad y provincia
    buscarMunicipio($(this).val());
});

//
//Código postal

//Rellenar el nombre de usuario al introducir el email
//
$('#inputEmail1').on('change', function() {
    $('#inputUsuario').val($(this).val());
    $('#inputUsuario').prop('readonly', true);
});
//
//Rellenar el nombre de usuario al introducir el email

//complejidad de contraseña
//
$.validator.addMethod('complex', function(value, element) {
    return $('#PassValue').val() >= $('#PassValue').attr('low');
});

//mostrar complejidad con jquery-complexify y determinar el valor para
var complexPass = function(valorSeguro) {
    //establecer valor de complejidad en barra meter html
    $('#PassValue').attr('low', valorSeguro);
    //console.log('low: ' + $('#PassValue').attr('low'));
    //analizar contraseña y mostrar en barra
    $('#inputContrasenna1').complexify({}, function(valid, complexity) {
        //console.log(valid + ' ' + complexity);
        //console.log($('#PassValue').val());
        $('#PassValue').val(complexity);
    });
};
//
//complejidad de contaseña


$(document).ready(function() {
    //iniciar complexity con valor mínimo de complejidad
    complexPass(40);
});
