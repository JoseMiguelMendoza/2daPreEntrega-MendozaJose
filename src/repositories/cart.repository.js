export default class CartRepository {
    constructor(dao){
        this.dao = dao
    }
    getAllCarts = async() => await this.dao.getAllCarts()
    createCart = async(data) => await this.dao.createCart(data)
    getCartById = async(id) => await this.dao.getCartById(id)
    getCartByIdMongooseObj = async(id) => await this.dao.getCartByIdMongooseObj(id)
    addProductInCart = async(cid, pid) => await this.dao.addProductInCart(cid, pid)
    getProductsFromCart = async(req, res) => await this.dao.getProductsFromCart(req, res)
    updateCart = async(id, products) => await this.dao.updateCart(id, products)
    deleteProductFromCart = async(cid, pid) => await this.dao.deleteProductFromCart(cid, pid)
    productsPopulated = async(cid) => await this.dao.productsPopulated(cid)
}