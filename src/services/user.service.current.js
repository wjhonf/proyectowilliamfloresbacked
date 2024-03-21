// Service (services/user.service.js)
const { getCurrentUserFromDatabase } = require('../DAO/mongo/user-dao-current.mongo');

async function getCurrentUser(userId) {
    try {
        return await getCurrentUserFromDatabase(userId);
    } catch (error) {
        throw new Error(`Error al obtener la información del usuario actual: ${error.message}`);
    }
}

module.exports = { getCurrentUser };

