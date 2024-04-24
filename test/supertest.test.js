
const { Cookie } = require("express-session");
const supertest = require("supertest");
const requester = supertest("http://localhost:8080");

// Test de router Products

describe("Testing Sistema de ventas", () => {
    describe("Test de Productos", () => {

        it("El endpoint POST api/products debe crear un producto correctamente", async () => {
            const { expect } = await import("chai");
            const productMock = {
                title: "Laptop Lenovo ThinkPad X1 Carbon",
                description: "Potente laptop empresarial con diseño delgado y ligero33.",
                code: "LTNVO-THNKPD-X1C",
                price: 1899.99,
                status: true,
                stock: 50,
                category: "Laptops",
                thumbnail: "../img/equipo5.jpg",
                owner: "admin",
            };
            if (!productMock.title || !productMock.code || !productMock.price || !productMock.stock) {
                console.error("Datos Incompletos");
                return;
            }
            const { statusCode, ok, _body } = await requester
                .post("/products")
                .send(productMock);
            console.log(statusCode, ok, _body);
            expect(_body.payload).to.have.property("_id");
            expect(_body.payload).to.have.property("status").to.be.true;

            
        });

    });
});


describe("Testing Sistema de ventas", () => {
    describe("Test de la ruta GET /products", () => {
        it("Renderizar la vista 'products' correctamente", async () => {
            const { expect } = await import("chai");
            const response = await requester.get("/products");
            expect(response.status).to.equal(200);
            expect(response.type).to.equal('text/html');
        });
        
    });
});


describe("Testing Sistema de ventas", () => {
    describe("Test de Productos", () => {

        it("El endpoint PUT api/products debe actualizar un producto correctamente", async () => {
            const { expect } = await import("chai");
            const productId = {
                _id: "6625a769ae053ac267a5e5da"
            };
            const dataUpdate = {
                title: "Laptop Lenovo ThinkPad X1 Carbon",
                description: "Potente laptop empresarial.",
                code: "LTNVO-THNKPD-X1C",
                price: 1899.99,
                status: true,
                stock: 50,
                category: "Laptops",
                thumbnail: "../img/equipo5.jpg",
                owner: "admin",
            };

            if (!dataUpdate.title || !dataUpdate.code || !dataUpdate.price || !dataUpdate.stock) {
                console.error("Datos Incompletos");
                return;
            }

            try {
                const response = await requester
                .put(`/products/${productId._id}`)
                .send(dataUpdate);
                expect(response.status).to.equal(200);
                expect(response.body).to.have.property("status");
                console.log(response.body);
            } catch (error) {
                console.error("Error:", error);
            }
        });
    });
});

describe("Testing Sistema de ventas", () => {
    describe("Test de Productos", () => {

        it("El endpoint DELETE api/products debe eliminar un producto", async () => {
            const { expect } = await import("chai");
            const productId = {
                _id: "6625c78ff21b5583f817b4f0"
            };
            try {
                const response = await requester
                    .delete(`/products/${productId._id}`);
                expect(response.status).to.equal(200);
                expect(response.body).to.have.property("status");
                console.log(response.body);
            } catch (error) {
                console.error("Error:", error);
            }
        });
    });
});


//Test Router Usuario = sessions

describe("Test Usuario", () =>{
    it("Debe registrar correctamente a un usuario", async function(){
        const { expect } = await import("chai");
        const dataUser ={
            first_name:"Jhon",
            last_name:"Jhon",
            email:"floress@flores.com",
            password:"12346",
            role:"admin"
        };
        try {
            const response = await requester
                .post("/users")
                .send(dataUser);
            expect(response.status).to.equal(200);
            expect(response.body).to.have.property("status").equal("success");
            console.log(response.body)
        } catch (error) {
            console.error("Error:", error);
        }
    });

});

describe("Test Usuario", () => {
    it("Debe loguear correctamente a un usuario y devolver la cookie", async function () {
        const { expect } = await import("chai");
        const User = {
            email: "floress@flores.com",
            password: "12346",
        };
        const response = await requester.post("/login").send(User);
        const cookieResult = response.headers["set-cookie"][0];
        expect(cookieResult).to.be.ok;
        const cookie = {
            name: cookieResult.split("=")[0],
            value: cookieResult.split("=")[1]
        };
        expect(cookie.name).to.be.eql('authToken');
        expect(cookie.value).to.be.ok;
        console.log('Cookie:', cookie);
        console.log(response.body)
    });
});

// Test Carts

describe("Testing Sistema de ventas", () => {
    describe("Test de Carritos", () => {

        it("El endpoint POST api/carts debe crear un carrito correctamente", async () => {
            const { expect } = await import("chai");
            const cartMock = {
                userId: "65f9b48dc0a25b2969347d7c",
                nombre: "William Flores",
                direccion: "Calle Jr. ",
                email: "flores@flores.com",
                items: [
                    { productId: "661caaab0634f8ea0128bbbd", quantity: 2 },
                    { productId: "661caaaa0634f8ea0128bbbb", quantity: 1 }
                ],
                totalPrice: 100.00, 
                ticketCode: "TICKET123" 
            };
            if (!cartMock.userId || !cartMock.nombre || !cartMock.direccion || !cartMock.email || !cartMock.items) {
                console.error("Datos Incompletos");
                return;
            }
            const { statusCode, ok, _body } = await requester
                .post("/productcatalog")
                .send(cartMock);
            expect(_body.payload).to.have.property("_id");
            console.log(statusCode, ok, _body);
            
        });

    });
});

describe("Testing Sistema de ventas", () => {
    describe("Test de la ruta GET /listcarts/view", () => {
        it("Renderizar la vista 'carts' correctamente", async () => {
            const { expect } = await import("chai");
            const response = await requester.get("/listcarts/view");
            expect(response.status).to.equal(200);
            expect(response.type).to.equal('text/html');
        });
        
    });
});


describe("Testing Sistema de ventas", () => {
    describe("Test de la ruta DELETE /carts/:id", () => {
        it("Eliminar un carrito correctamente", async () => {
            const { expect } = await import("chai");
            const cartId = "662861675b249c5b53779502"; 
            const response = await requester.delete(`/listcarts/carts/${cartId}`);
            expect(response.body).to.have.property("status");
            console.log(response.body);
        });
    });
});
