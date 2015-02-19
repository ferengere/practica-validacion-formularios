'use strict';
$.validator.setDefaults({
		submitHandler: function() {
			//a ejecutar antes de realizar el envío del formulario
			//pedir confirmación de la cuota a ser cargada, según forma de pago elegida
			var opcion = $('#inputFormaPago option:selected').val();
			var cuota = 0;
			console.log('formapago: ' + opcion);
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
			console.log('cuota: ' + cuota);
			
			$('#myModal .modal-body p').html('');
			$('#myModal .modal-body').append('<p>Se va a proceder a darle de alta.</p>');
			$('#myModal .modal-body').append('<p>Se le cobrará una primera cuota de ' + cuota + '€.</p>');
			$('#myModal .modal-body').append('<p class="text-warning"><small>Pulse Aceptar si está conforme.</small></p>');
			$('#myModal').modal({backdrop: 'static', keyboard: false}).one('click', function(evt) {
            //$('#formulario').trigger('submit'); // submit the form
            //var button = $(event.relatedTarget);
            //console.log(button.text());
            //return;
        });
			//recoger botones
			/*$("#myModal").on('shown.bs.modal', function(event){
        // Get button that triggered the modal
        var button = $(event.relatedTarget);
        // Extract value from data-* attributes
        //var titleData = button.data('title');
        //$(this).find('.modal-title').text(titleData + ' Form');
        console.log(button);
    		});*/
		}
	});

//comprobar que los dos campos email sean iguales
$.validator.addMethod('compEmail', function() {
	//console.log('compEmail');
	return $('#inputEmail1').val() === $('#inputEmail2').val();
});

//comprobar que los dos campos contraseña sean iguales
$.validator.addMethod('compPass', function() {
	//console.log('compPass');
	return $('#inputContrasenna1').val() === $('#inputContrasenna2').val();
});

//comprobar que el usuario no existe
$.validator.addMethod('compUsuario', function() {
	//console.log('Usuario: ' + $(this).val());
	//return $('#inputContrasenna1').val() === $('#inputContrasenna2').val();
	return false;
});

$('#formulario').validate({
	onkeyup: false,
	onfocusout: false,
	onclick: false,
	//reglas de validación para todos los campos
	rules: {
		//Información de contacto
		/*inputNombre: {
			required: true
		},
		inputApellidos: {
			required: true
		},
		inputTelefono: {
			required: true,
			digits: true,
			minlength: 9,
			maxlength: 9
		},
		inputEmail1: {
			required: true,
			email: true
		},
		inputEmail2: {
			compEmail: true,
			email: true
		},
		//Datos de facturación
		inputDemandante: {
			required: true
		},
		inputCifNif: {
			required: true
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
			max: 5
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
			iban: true
		},
		inputFormaPago: {
			required: true
		},
		//Datos de acceso
		inputUsuario: {
			required: true,
			minlength: 4//,
			//compUsuario: true
		},
		inputContrasenna1: {
			required: true
		},
		inputContrasenna2: {
			compPass: true
		}*/
	},
	messages: {
		//Información de contacto
		inputNombre: {
			required: 'Debe escribir su nombre'
		},
		inputApellidos: {
			required: 'Debe escribir sus apellidos'
		},
		inputTelefono: {
			required: 'Debe escribir su teléfono',
			digits: 'Debe escribir dígitos',
			minlength: jQuery.validator.format('La longitud debe ser {0}'),
			maxlength: jQuery.validator.format('La longitud debe ser {0}')
		},
		inputEmail1: {
			required: 'Debe escribir su email',
			email: 'Debe introducir un email válido'
		},
		inputEmail2: {
			compEmail: 'Los dos campos email deben coincidir',
			email: 'Debe introducir un email válido'
		},
		inputCifNif: {
			required: 'Debe escribir el identificador fiscal'
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
			max: jQuery.validator.format('La longitud máxima es {0}')
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
			iban: 'El IBAN debe ser válido'
		},
		inputFormaPago: {
			required: 'Debe elegir la forma de pago'
		},
		//Datos de acceso
		inputUsuario: {
			required: 'Debe escribir su nombre de usuario',
			minlength: jQuery.validator.format('El tamaño debe ser mínimo {0} caracteres')//,
			//compUsuario: 'El usuario indicado ya existe'
		},
		inputContrasenna1: {
			required: 'Debe escribir la contraseña'
		},
		inputContrasenna2: {
			compPass: 'Los dos campos de contraseña deben coincidir'
		}
	}
});

//Ajustar campos y datos según es particular o empresa
//
var rellenaNombreEmpresa = function(){
	//console.log('dem: ' + $('#inputDemandante').val());
	if ($('#inputDemandante').val() === 'p'){
		var text = $('#inputNombre').val() + ' ' + $('#inputApellidos').val();
		$('#inputNombreEmpresa').val(text);
	}
};

//Al cambiar nombre o apellido, rellenar el nombe de datos de empresa
$('#inputNombre').on('change', rellenaNombreEmpresa);
$('#inputApellidos').on('change', rellenaNombreEmpresa);

//al cambiar el tipo de demandante, cambiar cif/nif, particular/empresa, nombre empresa/particular
$('#inputDemandante').on('change', function(){
	//console.log($("#inputDemandante option:selected").text());
	if ($(this).val() === 'p'){
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

//rellenar el código postal
$('#inputCp').on('change', function(){
	var cpAnt = $(this).val();
	var len = $(this).val().length;
	var cpPos = '';
	//console.log(len + ' ' + cpAnt);
	
	if (len < 5) {
		for (var i = 0; i < 5-len; i++) {
			cpPos += '0';
		}
	}
	$(this).val(cpPos + cpAnt);
});
//rellenar el código postal

//Rellenar el nombre de usuario al introducir el email
//
$('#inputEmail1').on('change', function(){
	$('#inputUsuario').val($(this).val());
	$('#inputUsuario').prop('readonly', true);
});
//
//Rellenar el nombre de usuario al introducir el email

//prueba formapago
/*$('#inputFormaPago').on('change', function(){
	console.log('formapago: ' + $('#inputFormaPago option:selected').val());
});*/