document.getElementById("guardarequipo").addEventListener("click", function(event) {
  event.preventDefault(); 
  const formData = {
    title: document.getElementById("title").value,
    code: document.getElementById("code").value,
    price: document.getElementById("price").value,
    stock: document.getElementById("stock").value,
    category: document.getElementById("category").value,
    thumbnail: document.getElementById("thumbnail").value,
    description: document.getElementById("description").value
  };
  fetch("/products", {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(formData)
  })
  .then(response => response.json())
  .then(data => {
    if (data.status === "success") {
      Swal.fire({
        icon: "success",
        title: "Equipo registrado exitosamente"
      }).then(() => {
        window.location.href = "/products"; 
      });
    } else {
      Swal.fire({
        icon: "error",
        title: "Error al registrar el equipo",
        text: data.error || "Hubo un problema al registrar el equipo"
      });
    }
  })
  .catch(error => {
    console.error("Error:", error);
    Swal.fire({
      icon: "error",
      title: "Error al enviar la solicitud",
      text: "Hubo un problema al enviar la solicitud."
    });
  });
});

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
icon: 'error',
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
          title: 'Equipo Actualizado',
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
          icon: 'danger',
          title: 'Error al actualizar equipo',
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



