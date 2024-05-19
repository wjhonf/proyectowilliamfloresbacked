
const form = document.getElementById('loginForm');

form.addEventListener('submit', e => {
  e.preventDefault();
  const data = new FormData(form);
  const obj = {};
  data.forEach((value, key) => (obj[key] = value));
  fetch('/auth/login', {
    headers: {
      'Content-Type': 'application/json',
    },
    method: 'POST',
    body: JSON.stringify(obj),
  })
    .then(response => {
      if (response.ok) {
        return response.json();
      } else {
        return response.json().then(data => {
          throw new Error(data.error);
        });
      }
    })
    .then(data => {
      Swal.fire({
        icon: 'success',
        title: 'Inicio de sesión exitoso',
        text: '¡Bienvenido de nuevo!',
      });
      window.location.href = '/home';
    })
    .catch(error => {
      Swal.fire({
        icon: 'error',
        title: 'Error en el inicio de sesión',
        text: error.message,
      });
    });
});
