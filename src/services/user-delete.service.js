const User = require('../DAO/mongo/models/user.model');
const transport = require('../utils/nademailer.util'); 

const enviarCorreo = async (email) => {
    const mailOptions = {
      from: email.identifier,
      to: email,
      subject: 'Cuenta Eliminada por Inactividad',
      text: `Estimado Usuario,\n\nSu cuenta ha sido eliminada por inactividad\n\n
      E-COMMERCE - SISTEMA DE VENTAS\n\n`,
    };
    try {
      await transport.sendMail(mailOptions);
    } catch (error) {
      throw new Error('Error al enviar el correo electrónico');
    }
  };
async function limpiarUsuariosInactivos() {
  try {
    const cutoffDate = new Date(Date.now() - 30 * 60 * 1000);
    const usersToDelete = await User.find({ last_connection: { $lt: cutoffDate } });
    for (const user of usersToDelete) {
      await User.deleteOne({ _id: user._id });
      enviarCorreo(user.email, 'Tu cuenta ha sido eliminada por inactividad');
    }
  } catch (error) {
    console.error(error);
  }
}
module.exports = {
  limpiarUsuariosInactivos,
};
