function ocultarBotonSubir() {
    const fotoPerfil = document.getElementById('fotoPerfil');
    const btnsubir = document.getElementById('btnsubir');

    if (fotoPerfil.getAttribute('src') !== '') {
        btnsubir.style.display = 'none';
    } else {
        btnsubir.style.display = 'block';
    }
}
document.addEventListener('DOMContentLoaded', function() {
    ocultarBotonSubir()
    document.getElementById('btnAtras').addEventListener('click', function(event) {
        localStorage.clear();
    });
});
//document.addEventListener('DOMContentLoaded', ocultarBotonSubir);
function mostrarFoto(input) {
const allowedExtensions = /(\.jpg|\.jpeg|\.png)$/i;

if (input.files && input.files[0]) {
    const file = input.files[0];
    const fileName = file.name;

    if (!allowedExtensions.exec(fileName)) {
        Swal.fire({
            icon: 'error',
            title: 'Sitema de Ventas',
            text: 'Por favor, selecciona un archivo JPG o PNG.',
        });
        return;
    }

    const reader = new FileReader();
    reader.onload = function(e) {
        document.getElementById('fotoPerfil').src = e.target.result;
        document.getElementById('fotoPerfil').style.display = 'block';
        document.getElementById('fotoPlaceholder').style.display = 'none';
        document.getElementById('btnsubir').style.display = 'none';
        document.getElementById('btneliminar').style.display = 'block';
    };
    reader.readAsDataURL(file);
}
}
function eliminarFoto() {
document.getElementById('fotoPerfil').src = '';
document.getElementById('fotoPerfil').style.display = 'none';
document.getElementById('inputFoto').value = '';
document.getElementById('fotoPlaceholder').style.display = 'block';
document.getElementById('btnsubir').style.display = 'block';
document.getElementById('btneliminar').style.display = 'none';
}

let tiposDocumentosSeleccionados = [];
let archivosGuardados = JSON.parse(localStorage.getItem('archivosGuardados')) || {};
function renombrarYMostrarArchivos() {
let archivos = document.getElementById("inputArchivo").files;
let select = document.getElementById("tipoArchivo");
let listaArchivos = document.getElementById("listaArchivos");
let tipoDocumentoSeleccionado = select.value;
if (!tipoDocumentoSeleccionado) {
    Swal.fire({
        icon: 'error',
        title: 'Sistema de Ventas',
        text: 'Por favor, seleccione un tipo de documento.',
    });
    document.getElementById("inputArchivo").value = "";
    return;
}
for (let i = 0; i < archivos.length; i++) {
    let archivo = archivos[i];
    let nombreArchivo = archivo.name;
    let extension = nombreArchivo.split('.').pop().toLowerCase(); 
    if (extension !== 'pdf') {
        Swal.fire({
            icon: 'error',
            title: 'Sistema de Ventas',
            text: 'Por favor, seleccione solo archivos PDF.',
        });
        continue; 
    }
    let nombreRenombrado = tipoDocumentoSeleccionado + '.' + extension; 
    if (archivosGuardados[nombreRenombrado]) {
        Swal.fire({
            icon: 'error',
            title: 'Sistema de Ventas',
            text: 'Ya se ha seleccionado un archivo con el mismo nombre.',
        });
        continue;
    }
    archivosGuardados[nombreRenombrado] = archivo;
    localStorage.setItem('archivosGuardados', JSON.stringify(archivosGuardados));
    let divArchivo = document.createElement("div");
    divArchivo.classList.add("d-flex", "justify-content-between", "align-items-center", "border", "p-2", "mb-2");
    let pNombreArchivo = document.createElement("p");
    pNombreArchivo.classList.add("m-0");
    pNombreArchivo.textContent = nombreRenombrado;
    let btnEliminar = document.createElement("button");
    btnEliminar.classList.add("btn", "btn-danger", "btn-sm");
    btnEliminar.innerHTML = '<i class="bi bi-trash"></i>'; 
    btnEliminar.onclick = function() {
        divArchivo.remove();
        eliminarArchivoDeLocalStorage(nombreRenombrado);
    };
    divArchivo.appendChild(pNombreArchivo);
    divArchivo.appendChild(btnEliminar);
    listaArchivos.appendChild(divArchivo);
}
document.getElementById("inputArchivo").value = "";
}

function eliminarArchivoDeLocalStorage(nombreArchivo) {
delete archivosGuardados[nombreArchivo];
localStorage.setItem('archivosGuardados', JSON.stringify(archivosGuardados));
localStorage.removeItem(nombreArchivo);
}
function eliminarArchivoDeLocalStorage(nombreArchivo) {
delete archivosGuardados[nombreArchivo];
localStorage.setItem('archivosGuardados', JSON.stringify(archivosGuardados));
}
function actualizar() {
if (!document.getElementById('fotoPerfil').src || document.getElementById('listaArchivos').childElementCount !== 3) {
Swal.fire({
    icon: 'error',
    title: '¡Actualización a Premium!',
    text: 'Por favor, carga tu foto de perfil y tres archivos antes de actualizar a Premium.',
});
return;
}
const fotoPerfil = document.getElementById('inputFoto').files[0];
enviarArchivosAlServidor(fotoPerfil);
}
function enviarArchivosAlServidor(fotoPerfil) {
const userId = document.getElementById('iduser').value;
const nombresArchivos  = JSON.parse(localStorage.getItem('archivosGuardados')) || {};
const formData = new FormData();
if (fotoPerfil) {
formData.append('profileImage', fotoPerfil);
}
for (const nombreArchivo in archivosGuardados) {
const archivoInfo = archivosGuardados[nombreArchivo];
const archivo = new Blob([archivoInfo], { type: 'application/pdf' }); 
formData.append('documents', archivo, nombreArchivo);
}
fetch('/users/' + userId + '/documents', {
method: 'POST',
body: formData,
})
.then(response => {
if (!response.ok) {
  throw new Error('Error al enviar los datos del perfil');
}
return response.json();
})
.then(data => {
 Swal.fire({
      icon: 'success',
      title: '¡Éxito!',
      text: 'Datos del perfil actualizados correctamente',
      showCancelButton: false,
      confirmButtonText: 'Ok',
});
localStorage.clear();
window.location.href = '/profile';
})
.catch(error => {
Swal.fire({
  icon: 'error',
  title: 'Error',
  text: 'No se pudieron enviar los datos del perfil',
});
});
}
