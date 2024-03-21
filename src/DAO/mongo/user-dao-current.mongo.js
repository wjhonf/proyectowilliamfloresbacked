const User = require('../mongo/models/user.model');

async function getCurrentUserFromDatabase(userId) {
    try {
        return await User.findById(userId);
    } catch (error) {
        throw new Error(`Error al obtener el usuario actual: ${error.message}`);
    }
}

module.exports = { getCurrentUserFromDatabase };
