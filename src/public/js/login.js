const form = document.getElementById('loginForm');
form.addEventListener('submit', e => {
  e.preventDefault();
  const data = new FormData(form);
  const obj = {};
  data.forEach((value, key) => {
    obj[key] = value;
  });
  const fetchParams = {
    url: '/auth/login', 
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
          title: 'Inicio de sesión exitoso',
          text: '¡Bienvenido/a a Compras en Línea!',
          confirmButtonColor: '#28a745',
        }).then(() => {
          window.location.href = '/home';
        });
      } else {
        Swal.fire({
          icon: 'error',
          title: 'Inicio de sesión fallido',
          text: data.message || 'Ocurrió un error desconocido.',
          confirmButtonColor: '#dc3545',
          confirmButtonText: 'Intentar de nuevo'
        });
      }
    })
    .catch(error => {
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'Ocurrió un error al intentar iniciar sesión'
      });
    });
});
