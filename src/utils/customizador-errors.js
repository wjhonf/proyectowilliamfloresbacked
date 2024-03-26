
const errorDictionary = {
    MISSING_TITLE: 'El título del producto es requerido.',
    MISSING_PRICE: 'El precio del producto es requerido.',
    INVALID_FIELD: 'El campo {{field}} es inválido.',

};
function customizeError(error) {
    if (error.name === 'ValidationError') {
        const errorDetails = getErrorDetails(error);
        const errorMessages = errorDetails.map(detail => {
            if (errorDictionary[detail.field]) {
                return errorDictionary[detail.field];
            } else {
                return errorDictionary.INVALID_FIELD.replace('{{field}}', detail.field);
            }
        });
        return errorMessages;
    } else {
        return error.message || 'Error interno del servidor';
    }
}
function getErrorDetails(error) {
    return Object.keys(error.errors).map(field => ({
        field,
        type: error.errors[field].kind,
    }));
}


module.exports = customizeError;
