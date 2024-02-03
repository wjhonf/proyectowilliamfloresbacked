const form = document.getElementById('loginForm');
form.addEventListener('submit', e => {
  e.preventDefault();
  const data = new FormData(form);
  const obj = {};
  data.forEach((value, key) => {
    obj[key] = value;
  });
  const fetchParams = {
    url: '/auth',
    headers: {
      'Content-Type': 'application/json',
    },
    method: 'POST',
    body: JSON.stringify(obj),
  };
  fetch(fetchParams.url, fetchParams)
    .then(response => response.json())
    .then(data => {
      if (data.success) {
        Swal.fire({
          icon: 'success',
          title: 'Inicio exitoso',
          text: 'Bienvenido/(a) a Compras en Online!',
          confirmButtonColor: '#28a745',
        }).then(() => {
          window.location.href = '/home';
        });
      } else {
        Swal.fire({
          icon: 'error',
          title: 'Compras en Online',
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
        text: error
      });
    });
});
