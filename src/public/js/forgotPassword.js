const form = document.getElementById('forgotPassword');
form.addEventListener('submit', e => {
  e.preventDefault();
  const data = new FormData(form);
  const obj = {};
  data.forEach((value, key) => {
    obj[key] = value;
  });
  const fetchParams = {
    url: '/auth/forgot-password',
    headers: {
      'Content-Type': 'application/json',
    },
    method: 'POST',
    body: JSON.stringify(obj),
  };
  fetch(fetchParams.url, fetchParams)
    .then(response => response.json())
    .then(data => {
      if (data.status === 'Success') {
        Swal.fire({
          icon: 'success',
          title: 'Contraseña Actualizada',
          text: '¡Tu Contraseña ha sido actualizada!',
          confirmButtonColor: '#28a745',
        }).then(() => {
          window.location.href = '/login';
        });
      } else {
        Swal.fire({
          icon: 'error',
          title: 'Intentar de nuevo',
          text: data.message,
          confirmButtonColor: '#dc3545',
          confirmButtonText: 'Intentar de nuevo'
        });
      }
    })
    .catch(error => {
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'Ocurrió un error al intentar restablecer la contraseña'
      });
    });
});
