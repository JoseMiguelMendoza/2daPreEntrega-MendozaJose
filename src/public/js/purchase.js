
function generateTicket(cid){
    let cartId = cid
    fetch(`/api/carts/${cartId}/purchase`, {
        method: 'POST'
    })
    .then(response => {
        if (response.ok) {
            window.location.href = '/products';
        } else {
            Toastify({
                text: "No se pudieron eliminar los productos del carrito",
                duration: 2000,
                gravity: "top",
                offset: {
                    x: 0,
                    y: 52
                },
                close: false,
                position: "left",
                stopOnFocus: false,
                style: {
                    background: "linear-gradient(to right, #020024, #790935, #ff003d)",
                    width: "340px",
                    height: "35px",
                    position: "absolute",
                    color: "white",
                    text: "center",
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    fontFamily: "'Kalam'",
                    fontWeight: "bold"
                }
            }).showToast();
        }
    })
    .catch(error => {
        console.error('Error al eliminar los productos del carrito:', error.message);
    });
}