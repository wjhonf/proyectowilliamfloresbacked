const {faker}= require('@faker-js/faker')
const generateProducts = () => {
    const products = [];
    for (let i = 0; i < 100; i++) {
        const product = {
            id: faker.datatype.uuid(),
            name: faker.commerce.productName(),
            price: faker.commerce.price(),
            description: faker.commerce.productDescription(),
            code: faker.lorem.word(),
            price: faker.datatype.number({ min: 100, max: 2000 }),
            status: faker.datatype.boolean(),
            stock: faker.datatype.number({ min: 0, max: 100 }),
            category: faker.commerce.department(),
            thumbnail: faker.image.urlPicsumPhotos(),
        };
        products.push(product);
    }
    return products;
};

module.exports = {
    generateProducts
};

