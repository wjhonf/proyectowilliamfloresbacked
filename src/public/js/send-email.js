document.addEventListener('DOMContentLoaded', function () {
    const resetPasswordForm = document.getElementById('resetPasswordForm');

    resetPasswordForm.addEventListener('submit', async function (event) {
        event.preventDefault();

        const email = document.getElementById('email').value;

        try {
            const response = await fetch('/send-reset-email', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ email })
            });

            if (response.ok) {
                await Swal.fire({
                    icon: 'success',
                    title: 'Correo enviado',
                    text: 'Se ha enviado un correo electrónico para restablecer la contraseña.'
                });
                window.location.href = '/login'; 
            } else {
                const errorData = await response.json();
                await Swal.fire({
                    icon: 'error',
                    title: 'Error',
                    text: errorData.error
                });
            }
        } catch (error) {
            console.error('Error:', error);
            await Swal.fire({
                icon: 'error',
                title: 'Error',
                text: 'Ha ocurrido un error al procesar la solicitud. Por favor, inténtalo de nuevo más tarde.'
            });
        }
    });
});