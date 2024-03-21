const { email } = require('../configs/app.config')
const transport = require('../utils/nademailer.util')

class MailAdapter {
  async sendMessage(messageInfo) {
    await transport.sendMail({
        from: email.identifier,
        to: messageInfo.email,
        subject: 'Bienvenido a nuestro Sitio - Compras Online',
        html: `
            <h1>Hola ${messageInfo.first_name}!!!</h1>
            <p>¡Gracias por registrarte en nuestro sitio de compras en línea!</p>
            <p>Esperamos que disfrutes de una experiencia de compra increíble.</p>
            <img src="cid:bienvenido" alt="bienvenido"/>
            <p>Disfrútalo</p
          <div>
          `,
          attachments: [
            {
              filename: 'bienvenido.jpg',
              path: process.cwd() + '/src/public/img/bienvenido.jpg',
              
              cid: 'bienvenido',

            }
            
          ],
          
      });
  }
}

module.exports = MailAdapter