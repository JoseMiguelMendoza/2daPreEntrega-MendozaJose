import { CartService, ProductService, TicketService, UserService } from "../services/index.js"


export const getCartsController = async(req, res) => {
    let result = await CartService.getAllCarts()
    res.status(201).json({ status: 'success', payload: result })
}

export const getCartsWithIdController = async(req, res) => {
    let result = await CartService.getProductsFromCart(req, res)
    if (result === null) return res.status(404).json({ status: 'error', error: 'Not Found'})
    return res.status(200).json({ status: 'success', payload: result })
}


export const createCartController = async(req, res) => {
    let addingCart = await CartService.createCart()
    return res.status(201).json({ status: 'success', payload: addingCart })
}

export const addProductInCartWithCidAndPidController = async(req, res) => {
    try{
        let cartId = req.params.cid
        let productId = req.params.pid
        let result = await CartService.addProductInCart(cartId, productId)
        if( typeof result === 'string'){
            return res.status(400).json({ status: 'error', error: result })
        }
        return res.status(201).json({ status: 'success', payload: result })
    }catch(err){
        res.status(500).json({ status: 'error', error: err.message })
    }
}

export const generateTicketController = async(req, res) => {
    try{
        let cartId = req.params.cid
        const user = await UserService.findUserById(req.session.passport.user)
        let productsInCart = await CartService.getProductsFromCart(req, res)
        let totalCartPrice = 0;
        let totalPrice = 0;
        let productsToPurchase = [];
        let productsUnavailable = []
    
        productsInCart.products.map(item => {
            const isAvailable = item.product.stock - item.quantity > 0;
            if(isAvailable){
                totalPrice = item.product.price * item.quantity;
                totalCartPrice  += totalPrice;
                productsToPurchase.push({
                    product: item.product._id,
                    quantity: item.quantity,
                });
            }
            else{
                totalPrice = item.product.price * item.quantity
                productsUnavailable.push({
                    product: item.product._id,
                    quantity: item.quantity
                })
            }
            if (productsToPurchase.length === 0) {
                return res.status(400).json({ status: 'error', error: 'No hay productos disponibles para comprar' });
            }
            return {
                ...item,
                isAvailable: isAvailable,
                totalPrice: totalPrice
            };
        });

        for (const productData of productsToPurchase) {
            const product = await ProductService.getProductById(productData.product);
            if (product) {
                product.stock -= productData.quantity;
                await product.save();
            }
        }

        let newTicket = {
            ammount: totalCartPrice,
            purchaser: user.email,
            products: productsToPurchase
        }

        let ticketGenerated = await TicketService.createTicket(newTicket)
        let userCart = await CartService.getCartByIdMongooseObj(cartId)

        userCart.products = productsUnavailable
        await userCart.save()
        res.status(200).json({ status: 'success', payload: ticketGenerated })
    }catch(err){
        res.status(500).json({ status: 'error', error: err.message })
    }
}

export const updateCartWithIdController = async(req, res) => {
    try {
        const cid = req.params.cid;
        const products = req.body.products;
        const updatedCart = await CartService.updateCart(cid, products)
        if (!updatedCart) {
            return res.status(404).json({ status: 'error', error: 'Carrito no encontrado' });
        }
        res.status(200).json({ status: 'success', message: 'Carrito actualizado con éxito', cart: updatedCart });
    } catch (err) {
        res.status(500).json({ status: 'error', error: err.message });
    }
}

export const updateQuantityProductInCartController = async(req, res) => {
    try {
        const cid = req.params.cid;
        const pid = req.params.pid;
        const quantity = req.body.quantity;
        const cart = await CartService.getCartById(cid)
        if (!cart) {
            return res.status(404).json({ status: 'error', error: 'Carrito no encontrado' })
        }

        const product = cart.products.find(product => product.product == pid);
        if (!product) {
            return res.status(404).json({ status: 'error', error: 'Producto no encontrado en el carrito' })
        }
        product.quantity = quantity;
        await cart.save()
        res.status(200).json({ status: 'success', message: 'Cantidad de ejemplares actualizada' })
    } catch (err) {
        res.status(500).json({ status: 'error', error: err.message })
    }
}

export const deleteAllProductsFromCartController = async(req, res) => {
    try {
        const cid = req.params.cid;
        const cart = await CartService.getCartByIdMongooseObj(cid)
        if (!cart) {
            return res.status(404).json({ status: 'error', error: 'Carrito no encontrado' })
        }
        cart.products = []
        await cart.save()
        
        let productsPopulated = await CartService.productsPopulated(cid)
        req.io.emit('productoEliminado', productsPopulated)
        res.status(200).json({ status: 'success', message: 'Todos los productos del carrito han sido eliminados' })
    } catch (err) {
        res.status(500).json({ status: 'error', error: err.message })
    }
}

export const deleteProductFromCartController = async(req, res) => {
    try {
        const cid = req.params.cid;
        const pid = req.params.pid;
        let result = await CartService.deleteProductFromCart(cid, pid)
        if(typeof result == 'string') return res.status(400).json({ status: 'error', error: result })
        let productsPopulated = await CartService.productsPopulated(cid)
        req.io.emit('productoEliminado', productsPopulated)

        return res.status(200).json({ status: 'success', message: 'Producto eliminado del carrito' });
    } catch (err) {
        res.status(500).json({ status: 'error', error: err.message });
    }
}