const socket = io();
function submitAddProductFormViaSocket() {
  const title = document.querySelector('[name="title"]').value;
  const description = document.querySelector('[name="description"]').value;
  const code = document.querySelector('[name="code"]').value;
  const price = document.querySelector('[name="price"]').value;
  const status = document.querySelector('[name="status"]').value;
  const stock = document.querySelector('[name="stock"]').value;
  const category = document.querySelector('[name="category"]').value;
  const thumbnail = document.querySelector('[name="thumbnail"]').value;
  const productData = {
    title,
    description,
    code,
    price,
    status,
    stock,
    category,
    thumbnail,
  };
  socket.emit('addProduct', productData);
}
socket.on('productAdded', response  => {
  console.log('Nuevo producto agregado');
  renderProduct(response.product);
});
function renderProduct(product) {
  const productList = document.querySelector('#productList');
  const productElement = document.createElement('div');
  productElement.classList.add('col');
  productElement.innerHTML = `
    <div class="card">
    <img src="${product.thumbnail}" alt="${product.title}" style="width: 10%; height: auto;">
    <div class="card-body">
    <h5 class="card-title">${product.title} - (${product.category})</h5>
    <p class="card-text">
    Código: ${product.code}<br>
    Descripción: ${product.description}<br>
    Precio: $${product.price}<br>
    Estado: ${product.status ? 'Disponible' : 'Agotado'}<br>
    Stock: ${product.stock} unidades<br>
    </p>
    </div>
    </div>
  `;
  productList.appendChild(productElement);
}


