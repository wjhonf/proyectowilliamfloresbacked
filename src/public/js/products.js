/*const socket = io();
function submitAddProductFormViaSocket() {
  const title = document.querySelector('[name="title"]').value;
  const description = document.querySelector('[name="description"]').value;
  const code = document.querySelector('[name="code"]').value;
  const price = document.querySelector('[name="price"]').value;
  const status = document.querySelector('[name="status"]').value;
  const stock = document.querySelector('[name="stock"]').value;
  const category = document.querySelector('[name="category"]').value;
  const thumbnail = document.querySelector('[name="thumbnail"]').value;
  const productData = {
    title,
    description,
    code,
    price,
    status,
    stock,
    category,
    thumbnail,
  };
  socket.emit('addProduct', productData);
}products
socket.on('productAdded', response  => {
  console.log('Nuevo producto agregado');
  renderProduct(response.product);
});
function renderProduct(product) {
  const productList = document.querySelector('#productList');
  const productElement = document.createElement('div');
  productElement.classList.add('col');
  productElement.innerHTML = `
    <div class="card">
    <img src="${product.thumbnail}" alt="${product.title}" style="width: 10%; height: auto;">
    <div class="card-body">
    <h5 class="card-title">${product.title} - (${product.category})</h5>
    <p class="card-text">
    Código: ${product.code}<br>
    Descripción: ${product.description}<br>
    Precio: $${product.price}<br>
    Estado: ${product.status ? 'Disponible' : 'Agotado'}<br>
    Stock: ${product.stock} unidades<br>
    </p>
    </div>
    </div>
  `;
  productList.appendChild(productElement);
}
*/
document.getElementById('searchButton').addEventListener('click', function() {
  const searchInput = document.getElementById('search').value;
  const categorySelect = document.getElementById('categorySelect').value;
  const sortSelect = document.getElementById('sortSelect').value;
  let query = '?';
  if (searchInput) query += `search=${searchInput}&`;
  if (categorySelect) query += `category=${categorySelect}&`;
  if (sortSelect) query += `sort=${sortSelect}&`;
  window.location.href = `/products${query}`;
});
let productIdToDelete;
function setProductIdToDelete(id) {
productIdToDelete = id;
}
function deleteProduct() {
if (productIdToDelete) {
fetch('/products/' + productIdToDelete, {
method: 'DELETE'
})
.then(response => response.json())
.then(data => {
$('#deleteModal').modal('hide');
Swal.fire({
toast: true,
icon: 'danger',
title: 'Equipo Elimiando',
animation: false,
position: 'top-end',
showConfirmButton: false,
timer: 700000,
timerProgressBar: true,
})
window.location.href = '/products'; 
})
.catch(error => console.error('Error:', error));
}
}
function loadProductData(productId) {
  $.ajax({
    url: `/products/${productId}`,
    type: 'GET',
    success: function (response) {
      if (response.status === 'success') {
        const product = response.payload;
         console.log(product)
        $('#editModal').on('hidden.bs.modal', function () {
          $('#id').val('');
          $('#editTitle').val('');
          $('#editCode').val('');
          $('#editPrice').val('');
          $('#editStock').val('');
          $('#editCategory').val('');
          $('#editThumbnail').val('');
          $('#editDescription').val('');
        });
        $('#id').val(product._id);
        $('#editTitle').val(product.title);
        $('#editCode').val(product.code);
        $('#editPrice').val(product.price);
        $('#editStock').val(product.stock);
        $('#editCategory').val(product.category);
        $('#editThumbnail').val(product.thumbnail);
        $('#editDescription').val(product.description);
      } else {
        Swal.fire({
          toast: true,
          icon: 'info',
          title: 'No se pudo cargar lo datos',
          animation: false,
          position: 'top-end',
          showConfirmButton: false,
          timer: 700000,
          timerProgressBar: true,
          })
      }
    },
    error: function () {
      Swal.fire({
        toast: true,
        icon: 'info',
        title: 'Error al cargar el sistema',
        animation: false,
        position: 'top-end',
        showConfirmButton: false,
        timer: 700000,
        timerProgressBar: true,
        })
    },
  });
}
function saveProductChanges() {
  var productId = $('#id').val(); 
  var updatedProductData = {
    title: $('#editTitle').val(),
    code: $('#editCode').val(),
    price: $('#editPrice').val(),
    stock: $('#editStock').val(),
    category: $('#editCategory').val(),
    thumbnail: $('#editThumbnail').val(),
    description: $('#editDescription').val(),
  };

  $.ajax({
    url: `/products/${productId}`,
    type: 'PUT',
    contentType: 'application/json',
    data: JSON.stringify(updatedProductData),
    success: function (response) {
      if (response.status === 'success') {
         Swal.fire({
          toast: true,
          icon: 'info',
          title: 'Equipo Actulizado',
          animation: false,
          position: 'top-end',
          showConfirmButton: false,
          timer: 700000,
          timerProgressBar: true,
          })
        $('#editModal').modal('hide');
        window.location.href = '/products';
      } else {
        Swal.fire({
          toast: true,
          icon: 'dager',
          title: 'Error al actulizar equipo',
          animation: false,
          position: 'top-end',
          showConfirmButton: false,
          timer: 700000,
          timerProgressBar: true,
          })
         window.location.href = '/products'; 
      }
    },
    error: function (error) {
      console.log('Error al actualizar el producto: ' + error.statusText);
    }
  });
}



