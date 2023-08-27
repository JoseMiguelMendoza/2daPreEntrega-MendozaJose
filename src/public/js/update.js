document.addEventListener('DOMContentLoaded', () => {
    const updateButtons = document.querySelectorAll('.buttonUpdateForm');

    updateButtons.forEach(button => {
    button.addEventListener('click', async () => {
        const idInput = document.getElementById('id').value
        const updatedProduct = {
            title: document.getElementById('title').value,
            description: document.getElementById('description').value,
            price: Number(document.getElementById('price').value),
            code: Number(document.getElementById('code').value),
            stock: Number(document.getElementById('stock').value),
            category: document.getElementById('category').value
        };

        try {
            const response = await fetch(`/api/products/${idInput}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(updatedProduct)
            });

            const result = await response.json();
            if (response.ok) {
                Swal.fire({
                icon: 'success',
                title: 'Producto Actualizado',
                text: 'El producto ha sido actualizado correctamente.',
                showConfirmButton: false,
                timer: 3000
                });
            location.reload();
            } else {
                Swal.fire({
                icon: 'error',
                title: 'Error',
                text: result.error
                });
            }
        } catch (error) {
            console.error('Error:', error);
        }
    });
        });
});