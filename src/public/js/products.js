let owner = '';
document.addEventListener("DOMContentLoaded", function() {
  document.getElementById("propietario").addEventListener("change", function() {
    if (this.checked) {
      owner = document.getElementById("iduser").value;
    } else {
      owner = '';
    }
  });
});

document.getElementById("guardarequipo").addEventListener("click", function(event) {
const inputFotop = document.getElementById('inputFotop');
if (!inputFotop.files || !inputFotop.files[0]) {
    Swal.fire({
      icon: 'error',
      title: 'Sisema de Ventas',
      text: 'Por favor, selecciona una imagen para el producto.'
    });
    event.preventDefault(); 
    return;
  }
  const fotoproduct = inputFotop.files[0];
  event.preventDefault();
  const formData = new FormData();
  formData.append('title', document.getElementById("title").value);
  formData.append('code', document.getElementById("code").value);
  formData.append('price', document.getElementById("price").value);
  formData.append('stock', document.getElementById("stock").value);
  formData.append('category', document.getElementById("category").value);
  formData.append('description', document.getElementById("description").value);
  formData.append('owner', owner);
  if (fotoproduct) {
    formData.append('thumbnail', fotoproduct);
  }
  fetch("/products", {
    method: "POST",
    body: formData
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
    .then(response => {
      if (response.ok) {
        return response.json();
      } else if (response.status === 400) {
        throw new Error('No tienes permisos para eliminar este producto');
      } else if (response.status === 404) {
        throw new Error('Producto no encontrado');
      } else {
        throw new Error('Error al eliminar el producto');
      }
    })
    .then(data => {
      $('#deleteModal').modal('hide');
      Swal.fire({
        toast: true,
        icon: 'success',
        title: 'Producto Eliminado',
        animation: false,
        position: 'top-end',
        showConfirmButton: false,
        timer: 1500
      });
      window.location.href = '/products'; 
    })
    .catch(error => {

      $('#deleteModal').modal('hide');
      Swal.fire({
        toast: true,
        icon: 'error',
        title: error.message,
        animation: false,
        position: 'top-end',
        showConfirmButton: false,
        timer: 1500
      });
    });
  } else {
    console.error('No se ha establecido ningún ID de producto para eliminar');
    $('#deleteModal').modal('hide');
    Swal.fire({
      toast: true,
      icon: 'error',
      title: 'No se ha establecido ningún ID de producto para eliminar',
      animation: false,
      position: 'top-end',
      showConfirmButton: false,
      timer: 1500
    });
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
          $('#editfotoproduct').attr('src', '');
          $('#editfotoproduct').css('display', 'none');
          $('#editDescription').val('');
          $('#propietario').prop('checked', false);
        });
        $('#sinfotoproduct').css('display', 'none');
        $('#subirfotoproduct').css('display', 'none');
        $('#elimfotoproduct').css('display', 'block');
        let thumbnailUrl = product.thumbnail;
        $('#id').val(product._id);
        $('#editTitle').val(product.title);
        $('#editCode').val(product.code);
        $('#editPrice').val(product.price);
        $('#editStock').val(product.stock);
        $('#editCategory').val(product.category);
        $('#editfotoproduct').attr('src', thumbnailUrl);
        $('#editfotoproduct').css('display', 'block');
        $('#editDescription').val(product.description);
        let checkbox = document.getElementById("editpropietario");
        if (product.owner !== 'admin') {
            checkbox.checked = true; 
        }
        else{
          checkbox.checked = false;
        }
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
  let productId = $('#id').val();
  let owner =""
  const imgedit = document.getElementById('editfotoproduto');
  let checkbox = document.getElementById("editpropietario");
  if (checkbox.checked) {
    owner =document.getElementById("iduser").value
  } else {
    owner=''  
  }
  const formData = new FormData();
  formData.append('title', $('#editTitle').val());
  formData.append('code', $('#editCode').val());
  formData.append('price', $('#editPrice').val());
  formData.append('stock', $('#editStock').val());
  formData.append('category', $('#editCategory').val());
  formData.append('description', $('#editDescription').val());
  formData.append('owner', owner);
  const thumbnailFile = imgedit.files[0];
  formData.append('thumbnail', thumbnailFile);
  $.ajax({
    url: `/products/${productId}`,
    type: 'PUT',
    data: formData, 
    processData: false, 
    contentType: false, 
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



