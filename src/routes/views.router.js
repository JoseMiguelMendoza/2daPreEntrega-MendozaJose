import { Router } from 'express'
import ProductManager from '../dao/mongo/productManager.js'
import CartManager from '../dao/mongo/cartManager.js'
import cartModel from '../dao/models/cart.model.js'

const viewsRouter = Router()
const productManager = new ProductManager()
const cartManager = new CartManager()

viewsRouter.get('/', async(req, res) => {
    let result = await productManager.getProducts()
    res.render('home', {
        title: "Programación backEnd | Handlebars",
        products: result
    })
})

viewsRouter.get('/realTimeProducts', async(req, res) => {
    res.render('realTimeProducts', {
        title: "Handlebars | Websocket",
        products: await productManager.getProducts()
    })
})

viewsRouter.get('/products', async(req, res) => {
    const result = await productManager.getProductsWithFilters(req)
    res.render('products', {
        title: 'Paginate | Handlebars',
        products: result.response.payload,
        paginateInfo : {
            hasPrevPage: result.response.hasPrevPage,
            hasNextPage: result.response.hasNextPage,
            prevLink: result.response.prevLink,
            nextLink: result.response.nextLink
        }
    })
})

viewsRouter.get('/carts/:cid', async(req, res) =>{
    try{
        let cid = req.params.cid
        let cartById = await cartModel.findById(cid).populate('products.product').lean()
        if(cartById === null){
            return res.status(404).json({ status: 'error', error: 'Not Found'})
        }
        res.render('cart', {
            title: 'Carrito',
            cid: cartById._id,
            products: cartById.products
        })
    }catch(err){
        res.status(500).json({ status: 'error', error: err.message })
    }
})

export default viewsRouter