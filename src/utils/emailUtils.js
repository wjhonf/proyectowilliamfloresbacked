const transport = require('./nademailer.util');

const sendPasswordResetEmail = async (email, token) => {
  const mailOptions = {
    from: email.identifier,
    to: email,
    subject: 'Recuperación de contraseña',
    text: `Hola,\n\nHaz clic en el siguiente enlace para restablecer tu contraseña:\n\n
    http://localhost:8080/reset-password?token=${token}\n\n
    Si no solicitaste este restablecimiento de contraseña, ignora este correo electrónico.\n`,
  };

  try {
    await transport.sendMail(mailOptions);
  } catch (error) {
    throw new Error('Error al enviar el correo electrónico');
  }
};

module.exports = {
  sendPasswordResetEmail,
};