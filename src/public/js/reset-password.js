document.addEventListener('DOMContentLoaded', function () {
    const resetPasswordForm = document.getElementById('resetPasswordForm');
    resetPasswordForm.addEventListener('submit', async function (event) {
        event.preventDefault();
        const newPassword = document.getElementById('newPassword').value;
        const token = getTokenFromURL();
        try {
            const response = await fetch('/reset-password', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({token, newPassword })
            });

            if (response.ok) {
                await Swal.fire({
                    icon: 'success',
                    title: 'Contraseña restablecida',
                    text: 'Tu contraseña ha sido cambiada exitosamente.'
                });
                window.location.href = '/login';
            } else {
                const errorData = await response.json();
                await Swal.fire({
                    icon: 'error',
                    title: 'Error',
                    text: errorData.error || 'Ha ocurrido un error al cambiar la contraseña. Por favor, inténtalo de nuevo más tarde.'
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
function getTokenFromURL() {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get('token');
}