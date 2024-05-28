const cron = require('node-cron');
const { limpiarUsuariosInactivos } = require('../services/user-delete.service');

cron.schedule('*/30 * * * *', async () => {
  await limpiarUsuariosInactivos();
});
