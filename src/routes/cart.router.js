import { Router } from 'express'
import CartManager from '../classes/CartManager.js'

const CartRouter = Router()
const cartManager = new CartManager("./src/models/carts.json")


CartRouter.get('/', async(req, res) => {
    res.send(await cartManager.getCarts())
})

CartRouter.get('/:cid', async(req, res) => {
    let id = req.params.cid
    let cartById = await cartManager.getCartsById(id)
    if(!cartById) return res.status(404).json({ error: `Error! No existe el id(${id}) en esta lista de carritos.` })
    return res.status(200).json({ cart: cartById })
})


CartRouter.post('/', async(req, res) => {
    await cartManager.addCarts()
    return res.status(200).json({ message: 'Carrito Agregado!'})
})

CartRouter.post('/:cid/product/:pid', async(req, res) => {
    let cartId = req.params.cid
    let productId = req.params.pid
    res.send(await cartManager.addProductInCart(cartId, productId))
})



export default CartRouter