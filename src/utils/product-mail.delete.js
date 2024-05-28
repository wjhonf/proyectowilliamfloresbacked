const transport = require('./nademailer.util');

const senddeleteproduct = async (email, nameprocut) => {
  const mailOptions = {
    from: email.identifier,
    to: email,
    subject: 'Producto Eliminado',
    text: `Hola,\n\nTu producto fue eliminado:${nameprocut}\n\n
    Saludos.\n\n`,
  };
  try {
    await transport.sendMail(mailOptions);
  } catch (error) {
    throw new Error('Error al enviar el correo electrónico');
  }
};

module.exports = {
    senddeleteproduct,
};