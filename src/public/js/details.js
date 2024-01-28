
  document.addEventListener('DOMContentLoaded', function () {
    const viewButtons = document.querySelectorAll('.btn-ver');
    function loadCartDetails(cartId) {
            $.ajax({
              url: `/listcarts/details/${cartId}`,
              type: 'GET',
              success: function (response) {
                if (response.status === 'success') {
                  const cart = response.data;
                  $('#cartName').text('');
                  $('#direccion').text('');
                  $('#cartName').text(cart.nombre);
                  $('#direccion').text(cart.direccion);
                  $('#cartDetailsTableBody').empty();
                  cart.items.forEach(item => {
                  const row = `<tr>
                  <td>${item.title}</td>
                  <td>${item.quantity}</td>
                  
                                 </tr>`;
                    $('#cartDetailsTableBody').append(row);
                });
                $('#cartDetailsModal').modal('show');
                } else {
                  Swal.fire({
                    toast: true,
                    icon: 'info',
                    title: 'No se pudo cargar los datos del carrito',
                    animation: false,
                    position: 'top-end',
                    showConfirmButton: false,
                    timer: 700000,
                    timerProgressBar: true,
                  });
                }
              },
              error: function () {
                Swal.fire({
                  toast: true,
                  icon: 'error',
                  title: 'Error al cargar los datos del carrito',
                  animation: false,
                  position: 'top-end',
                  showConfirmButton: false,
                  timer: 700000,
                  timerProgressBar: true,
                });
              },
            });
          
    }
    viewButtons.forEach(function(button) {
        button.addEventListener('click', function() {
            const icon = this.querySelector('i');
            const cartId = icon.getAttribute('data-id');
            loadCartDetails(cartId);
        });
    });
});
