const socket = io()

const btnDeleteProdFromCart = document.getElementsByClassName('btnDeleteProdFromCart');

Array.from(btnDeleteProdFromCart).forEach((button) => {
    button.addEventListener('click', eliminarProductoDelCarrito);
})

function eliminarProductoDelCarrito(e) {
    const cartId = e.target.dataset.cartId;
    const productId = e.target.dataset.productId;
    fetch(`/api/carts/${cartId}/products/${productId}`, {
        method: 'DELETE'
    })
    .then(response => {
        console.log(response)
        if (response.ok) {
            console.log('Producto eliminado del carrito');
            socket.emit('eliminarProductoDelCarrito', {cartId, productId});
        } else {
            console.log('No se pudo eliminar el producto del carrito');
        }
    })
    .catch(error => {
        console.error('Error al eliminar el producto del carrito:', error);
    });
}

socket.on('productoEliminado', async(updatedCart) => {
    try {
        console.log(updatedCart)
        let productsBox = document.querySelector('.productsBox');
        productsBox.innerHTML = '';
    
        updatedCart.products.forEach((product) => {
            let productoEnCarrito =
            `
            <div class="containerProduct">
                <div class="fontSizePropertiesProduct"><b>Title:</b> ${product.product.title}</div>
                <div class="fontSizePropertiesProduct"><b>Category:</b> ${product.product.category}</div>
                <div class="fontSizePropertiesProduct"><b>Quantity:</b> ${product.quantity}</div>
                <div class="fontSizePropertiesProduct"><b>Price:</b> $${product.product.price}</div>
                <div><button class="btnDeleteProdFromCart" data-cart-id="${updatedCart._id}" data-product-id="${product.product._id}">Eliminar producto</button></div>
            </div>
            `
            productsBox.innerHTML += productoEnCarrito
        });
    } catch (error) {
        console.error('Error al eliminar el producto del carrito:', error);
    }
});
