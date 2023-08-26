export default class ProductRepository {
    constructor(dao){
        this.dao = dao
    }
    getAllProducts = async() => await this.dao.getAllProducts()
    getAllPaginatedProducts = async(req) => await this.dao.getAllPaginatedProducts(req)
    getProductById = async(id) => await this.dao.getProductById(id)
    createProduct = async(data) => await this.dao.createProduct(data)
    updateProduct = async(id, data) => await this.dao.updateProduct(id, data)
    deleteProduct = async(id) => await this.dao.deleteProduct(id) 
}