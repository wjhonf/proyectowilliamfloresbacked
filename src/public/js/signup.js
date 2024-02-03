const form = document.getElementById('signupForm');
form.addEventListener('submit', e => {
    e.preventDefault();

    const data = new FormData(form);
    const obj = {};

    data.forEach((value, key) => {
        obj[key] = value;
    });

    const fetchParams = {
        url: '/users',
        headers: {
            'Content-type': 'application/json',
        },
        method: 'POST',
        body: JSON.stringify(obj),
    };
    fetch(fetchParams.url, {
      headers: fetchParams.headers,
      method: fetchParams.method,
      body: fetchParams.body,
  })
  .then(response => response.json())
  .then(data => {
      if (data.status === 'success') {
          Swal.fire({
              icon: 'success',
              title: 'Registro Exitoso',
              text: '¡Ya Puedes Iniciar Sesión!',
          }).then(() => {
              window.location.href = '/profile';
          });
      } else {
          Swal.fire({
              icon: 'error',
              title: 'Error en el Registro',
              text: data.payload.message || 'Ocurrió un error desconocido.',
          });
      }
  })
  .catch(error => {
      console.error('Error durante el registro:', error);
      Swal.fire({
          icon: 'error',
          title: 'Error en la Conexión',
          text: 'No se pudo conectar al servidor. Por favor, inténtelo de nuevo más tarde.',
      });
  });
});  