import cartModel from '../models/cart.model.js'
import productModel from '../models/product.model.js'

export default class CartDAO {
    getAllCarts = async() => await cartModel.find().lean().exec()
    createCart = async(data) => await cartModel.create(data)
    getCartById = async(id) => await cartModel.findById(id).lean().exec()
    getCartByIdMongooseObj = async(id) => await cartModel.findById(id)
    addProductInCart = async(cid, pid) => {
        let cartByIdInDB = await cartModel.findById(cid)
        if(!cartByIdInDB) return 'Cart Not Found'
        let productByIdInDB = await productModel.findById(pid)
        if(!productByIdInDB) return 'Product Not Found'

        const productIndex = cartByIdInDB.products.findIndex(
            (item) => item.product.toString() === pid
        );
        if (productIndex !== -1) {
            cartByIdInDB.products[productIndex].quantity += 1;
        } else {
            cartByIdInDB.products.push({
            product: pid,
            quantity: 1,
            });
        }
        await cartByIdInDB.save()
        return cartByIdInDB
    }
    getProductsFromCart = async(req, res) => {
        try{
            const id = req.params.cid
            const result = await cartModel.findById(id).populate('products.product').lean().exec()
            if(result === null){
                return null
            }
            return result
        }catch(err){
            res.status(500).json({ status: 'error', error: err.message })
        }
    }
    
    updateCart = async(cid, products) => await cartModel.findByIdAndUpdate(cid, { products }, { new: true })

    productsPopulated = async(cid) => await cartModel.findById(cid).populate('products.product').lean()

    deleteProductFromCart = async(cid, pid) => {
        const cart = await cartModel.findById(cid)
        if (!cart) {
            return 'Carrito no encontrado'
        }
        const productIndex = cart.products.findIndex(product => product.product == pid);
        if (productIndex === -1) {
            return 'Producto no encontrado en el carrito.'
        }
        cart.products.splice(productIndex, 1)
        await cart.save()
        return cart
    }
}
