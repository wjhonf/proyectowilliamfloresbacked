const { Router } = require('express');
const router = Router();
const { generateProducts } = require('../utils/equipos-mock.util');
const Product = require('../DAO/product.model');
const customizeError = require('../utils/customizador-errors');
router.get('/', (req, res) => {
    const products = generateProducts();
    const formattedProducts = JSON.stringify(products, null, 2);

    res.setHeader('Content-Type', 'application/json');
    res.send(formattedProducts);
});
router.post('/', async (req, res) => {
    const productData = req.body;
    try {
        const newProduct = new Product(productData); 
        res.status(201).json(newProduct);
    } catch (error) {
        if (error.name === 'ValidationError') {
        
            const errorMessages = customizeError(error);
            res.status(400).json({ error: 'Datos de producto inválidos', details: errorMessages });
        } else {
            res.status(500).json({ error: 'Error interno del servidor' });
        }
    }
});


module.exports = router;
