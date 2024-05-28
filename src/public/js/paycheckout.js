document.addEventListener('DOMContentLoaded', function() {
    const clearButton = document.getElementById('clearcard');
    clearButton.addEventListener('click', function(event) {
    localStorage.clear();
    });
    renderizarDetallesDelCarrito();
});
let totalesGlobales = { subtotal: 0, iva: 0, total: 0 };
function calcularTotales(datosDelCarrito, tasaIVA) {
    let subtotal = 0;
    datosDelCarrito.forEach(item => {
        subtotal += item.cantidad * item.precio;
    });
    const iva = subtotal * tasaIVA;
    const total = subtotal + iva;

    return { subtotal, iva, total };
}

function renderizarDetallesDelCarrito() {
    const datosDelCarrito = JSON.parse(localStorage.getItem('cartData')) || [];
    const contenedorDetallesCarrito = document.getElementById('cartDetails');

    if (datosDelCarrito.length === 0) {
        contenedorDetallesCarrito.innerHTML = '<p>El carrito está vacío.</p>';
    } else {
        let tabla = '<table class="table table-striped"><thead class="thead-dark"><tr><th>Descripción</th><th>Cantidad</th><th>Precio</th><th>Importe</th></tr></thead><tbody>';

        datosDelCarrito.forEach((item) => {
            const importe = item.cantidad * item.precio;
            tabla += `
                <tr>
                    <td>${item.equipo}</td>
                    <td>${item.cantidad}</td>
                    <td>$${item.precio.toFixed(2)}</td>
                    <td>$${importe.toFixed(2)}</td>
                </tr>
            `;
        });
        tabla += '</tbody></table>';
        contenedorDetallesCarrito.innerHTML = tabla;
        const tasaIVA = 0.18; 
        const totales = calcularTotales(datosDelCarrito, tasaIVA);
        totalesGlobales = totales;
        const resumenPago = `
            <div class="row justify-content-end mt-4">
                <div class="col-md-6">
                    <div class="card">
                        <div class="card-body">
                            <h5 class="card-title">Resumen de Pago</h5>
                            <ul class="list-group list-group-flush">
                                <li class="list-group-item d-flex justify-content-between align-items-center">
                                    Subtotal
                                    <span class="badge-primary">$${totales.subtotal.toFixed(2)}</span>
                                </li>
                                <li class="list-group-item d-flex justify-content-between align-items-center">
                                    IVA (${(tasaIVA * 100).toFixed(0)}%)
                                    <span class="badge-primary">$${totales.iva.toFixed(2)}</span>
                                </li>
                                <li class="list-group-item d-flex justify-content-between align-items-center">
                                    Total
                                    <span class="badge-primary">$${totales.total.toFixed(2)}</span>
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>
            </div>
        `;
        contenedorDetallesCarrito.insertAdjacentHTML('beforeend', resumenPago);
    }
}
document.getElementById('checkoutForm').addEventListener('submit', function(event) {
    event.preventDefault();
    const iduser = document.getElementById("iduser").value;
    if (!this.nombre.value || !this.direccion.value || !this.email.value) {
        Swal.fire({
                title: 'Campos Vacios',
                text: 'Por favor completar todos los campos',
                icon: 'warning',
                confirmButtonText: 'Ok',
                customClass: {
                    confirmButton: 'btn btn-warning'
                }})
        return;
    }
    const cartData = JSON.parse(localStorage.getItem('cartData')) || [];
    if (!cartData.length) {
        Swal.fire({
                title: 'Carrito vacío',
                text: 'Por favor, seleccione al menos un equipo para continuar',
                icon: 'warning',
                confirmButtonText: 'Ok',
                customClass: {
                    confirmButton: 'btn btn-warning'
                }})
        return;
    }
    const adaptedItems = cartData.map(item => ({
        productId: item.id, 
        quantity: item.cantidad
    }));
    const dataToSend = {
        userId: iduser, 
        nombre: this.nombre.value,
        direccion: this.direccion.value,
        email: this.email.value,
        items: adaptedItems,
        totalPrice:totalesGlobales.subtotal
    };
    fetch('/productcatalog', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(dataToSend)
    })
    .then(response => response.json())
    .then(data => {
        console.log('Success:', data);
        Swal.fire({
                title: 'Compras Online',
                text: 'Compra Exitosa',
                icon: 'info',
                confirmButtonText: 'Ok',
                customClass: {
                    confirmButton: 'btn btn-warning'
    }})
        let codigo= data.ticketCode
        window.location.href = `/ticket/${codigo}`;
        localStorage.clear();
    })
    .catch((error) => {
        Swal.fire({
                title: 'Error al realizar comora',
                text: 'Compra Erronea',
                icon: 'warning',
                confirmButtonText: 'Ok',
                customClass: {
                    confirmButton: 'btn btn-warning'
                }})
    }); 
});