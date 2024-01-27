let carrito = [];
let modalDetalleCarrito; 
let contenidoModal; 
let contadorCarrito; 
function actualizarContadorCarrito() {
    contadorCarrito.innerText = carrito.length;
}
document.addEventListener('DOMContentLoaded', function() {
    const verDetalle = document.getElementById('micarrito');
    const botonesComprar = document.querySelectorAll('.btn-comprar');
    contadorCarrito = document.getElementById('contadorCarrito');
    modalDetalleCarrito = new bootstrap.Modal(document.getElementById('modalDetalleCarrito'));
    contenidoModal = document.getElementById('contenidoModal');
    document.getElementById('btnCerrar').addEventListener('click', vaciarCarritoYCerrarModal);
    document.getElementById('btnAgregarMas').addEventListener('click', minimizarModal);
    
    botonesComprar.forEach(boton => {
        boton.addEventListener('click', async function() { 
            const productId = this.querySelector('.bi').getAttribute('data-id');
            const existeEnCarrito = carrito.some(item => item.id === productId);
            
            if (!existeEnCarrito) {
                try {
                    const detallesProducto = await obtenerDetallesProductoDesdeAPI(productId);
                    if (detallesProducto && detallesProducto.status === 'success' && detallesProducto.payload) {
                        carrito.push({
                            id: productId,
                            equipo: detallesProducto.payload.title,
                            cantidad: 1,
                            precio: detallesProducto.payload.price
                        });
                        actualizarContadorCarrito();
                    } else {
                        Swal.fire({
                            title: 'Sistema de Compras',
                            text: 'No cargo el servidor',
                            icon: 'info',
                            confirmButtonText: 'Ok',
                            customClass: {
                                confirmButton: 'btn btn-danger'  
                            }
                        });
                    }
                } catch (error) {
                    Swal.fire({
                        title: 'Sistema de Compras',
                        text: 'Error al agregar Equipo',
                        icon: 'info',
                        confirmButtonText: 'Ok',
                        customClass: {
                            confirmButton: 'btn btn-danger'  
                        }
                    });
                }
            } else {
                Swal.fire({
                    title: 'Sistema de Compras',
                    text: 'Equipo ya agregado a Cesta',
                    icon: 'info',
                    confirmButtonText: 'Ok',
                    customClass: {
                        confirmButton: 'btn btn-danger'  
                    }
                });
            }
        });
    });


    verDetalle.addEventListener('click', function() {
        if (carrito.length === 0) {
            Swal.fire({
                title: 'Carrito vacío',
                text: 'Por favor, seleccione al menos un equipo para continuar',
                icon: 'warning',
                confirmButtonText: 'Ok',
                customClass: {
                    confirmButton: 'btn btn-warning'
                }
            });
        } else {
            let modalElement = document.getElementById('modalDetalleCarrito');
            if (modalElement.dataset.minimized === "true") {
                toggleMinimizeModal();
            }
            mostrarDetallesCarrito();
        }
    });
    
});
async function obtenerDetallesProductoDesdeAPI(id) {
    return fetch(`/productcatalog/${id}`)
        .then((response) => response.json())
        .then((data) => data)
        .catch((error) => {
            console.log(error);
            return null;
        });
}
async function mostrarDetallesCarrito() {
    let contenidoCarrito = '<table class="table"><thead><tr><th>Descripción</th><th>Cantidad</th><th>Precio</th><th>Importe</th><th>Acciones</th></tr></thead><tbody>';
    let subtotal = 0;
    const IGV_TASA = 0.18; 
    for (const item of carrito) {
        const respuestaAPI = await obtenerDetallesProductoDesdeAPI(item.id);
        if (respuestaAPI && respuestaAPI.status === 'success' && respuestaAPI.payload) {
            const detallesProducto = respuestaAPI.payload;
            const costo = detallesProducto.price * item.cantidad;
            subtotal += costo;
            contenidoCarrito += `
                <tr>
                    <td>${detallesProducto.title}</td>
                    <td><input type="number" class="form-control cantidad-input" value="${item.cantidad}" onchange="actualizarCantidad('${item.id}', this.value)"></td>
                    <td>$${detallesProducto.price.toFixed(2)}</td>
                    <td>$${costo.toFixed(2)}</td>
                    <td><button class="btn btn-danger btn-sm" onclick="eliminarDelCarrito('${item.id}')"><i class="bi bi-trash"></i></button></td>
                </tr>`;
        }
    }
    const igv = subtotal * IGV_TASA;
    const total = subtotal + igv;
    contenidoCarrito += `
        </tbody>
        <tfoot>
            <tr>
                <td colspan="4">Subtotal</td>
                <td>$${subtotal.toFixed(2)}</td>
                <td></td>
            </tr>
            <tr>
                <td colspan="4">IGV (${(IGV_TASA * 100).toFixed(0)}%)</td>
                <td>$${igv.toFixed(2)}</td>
                <td></td>
            </tr>
            <tr>
                <td colspan="4"><strong>Total</strong></td>
                <td><strong>$${total.toFixed(2)}</strong></td>
                <td></td>
            </tr>
        </tfoot>
    </table>`;
    contenidoModal.innerHTML = contenidoCarrito;
    modalDetalleCarrito.show();
}
function actualizarCantidad(productId, nuevaCantidad) {
    const productoExistente = carrito.find((item) => item.id === productId);
    if (productoExistente) {
        productoExistente.cantidad = parseInt(nuevaCantidad) || 1;
        mostrarDetallesCarrito();
    }
}
function vaciarCarritoYCerrarModal() {
    carrito = []; 
    actualizarContadorCarrito(); 
    modalDetalleCarrito.hide(); 
}
function minimizarModal() {
    let modalElement = document.getElementById('modalDetalleCarrito');
    let modalDialog = modalElement.querySelector('.modal-dialog');
    if (!modalDialog.classList.contains('minimized')) {
        modalDialog.classList.add('minimized');
    } else {
        modalDialog.classList.remove('minimized');
    }
}
function eliminarDelCarrito(id) {
    const indice = carrito.findIndex((item) => item.id === id);
    if (indice !== -1) {
        carrito.splice(indice, 1);
        actualizarContadorCarrito();
        mostrarDetallesCarrito();
    }
}
function obtenerDatosDelCarrito() {
    return carrito.map(item => {
      
        return {
            id: item.id,
            equipo: item.equipo,
            cantidad: item.cantidad,
            precio: item.precio
        };
    });
}
