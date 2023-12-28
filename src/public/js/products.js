const socket = io();

function submitAddProductFormViaSocket() {
  console.log('Submit form called'); // Verifica si esta función se llama correctamente

  const title = document.querySelector('[name="title"]').value;
  const description = document.querySelector('[name="description"]').value;
  const code = document.querySelector('[name="code"]').value;
  const price = document.querySelector('[name="price"]').value;
  const status = document.querySelector('[name="status"]').value;
  const stock = document.querySelector('[name="stock"]').value;
  const category = document.querySelector('[name="category"]').value;
  const thumbnails = document.querySelector('[name="thumbnails"]').value;

  const productData = {
    title,
    description,
    code,
    price,
    status,
    stock,
    category,
    thumbnails,
  };
  socket.emit('addProduct', productData);
}
