function editUserRole(userId) {
    Swal.fire({
      title: '¿Estás seguro?',
      text: '¿Quieres cambiar el rol del usuario a Premium?',
      icon: 'question',
      showCancelButton: true,
      confirmButtonText: 'Si',
      cancelButtonText: 'Cancelar'
    }).then((result) => {
      if (result.isConfirmed) {
        const url = `/users/premium/${userId}`;
        fetch(url, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({ userId: userId }) 
        })
        .then(response => {
          if (!response.ok) {
            throw new Error('Failed to activate premium');
          }
          return response.json();
        })
        .then(data => {
          Swal.fire({
            icon: 'success',
            title: 'Usuario ahora es Premium',
            text: 'El rol del usuario ha sido cambiado a Premium correctamente',
            showConfirmButton: false,
            timer: 2000
          });
           window.location.href = '/users';
        })
        .catch(error => {
          Swal.fire({
            icon: 'error',
            title: 'Error',
            text: 'No se pudo activar el usuario a Premium',
            showConfirmButton: false,
            timer: 2000
          });
        });
      }
    });
  }