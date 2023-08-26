import { ProductService } from "../services/index.js";

export const getProducts = async(req, res) => {
    let result = await ProductService.getAllPaginatedProducts(req)
    res.status(result.statusCode).json(result.response)
}

export const getProductWithId = async(req, res) => {
    try{
        let id = req.params.id
        let productById = await ProductService.getProductById(id)
        if(productById === null){
            return res.status(404).json({ status: 'error', error: 'Not Found'})
        }
        return res.status(201).json({ status: 'success', payload: productById })
    } catch(err){
        res.status(500).json({ status: 'error', error: err.message })
    }
}

export const addProduct = async(req, res) => {
    try{
        let newProduct = req.body
        let productGenerated = await ProductService.createProduct(newProduct)
        const products = await ProductService.getAllProducts()
        req.io.emit('updatedProducts', products)
        res.status(201).json({ status: 'success', payload: productGenerated })
    } catch(err){
        res.status(500).json({ status: 'error', error: err.message})
    }
}

export const updateProductWithId = async(req, res) => {
    try{
        let id = req.params.id
        let productToUpdate = req.body
        let productUpdated = await ProductService.updateProduct(id, productToUpdate)
        if (productUpdated === null){
            return res.status(404).json({ status: 'error', error: 'Not Found' })
        }
        const products = await ProductService.getAllPaginatedProducts()
        req.io.emit('updatedProducts', products)
        return res.status(201).json({ status: 'success', payload: productUpdated })
    } catch(err){
        res.status(500).json({ status: 'error', error: err.message })
    }
}

export const deleteProductWithId = async(req, res) => {
    try{
        let id = req.params.id
        let deletingProduct = await ProductService.deleteProduct(id)
        if(deletingProduct === null){
            return res.status(404).json({ status: 'error', error: 'Not Found'})
        }
        const products = await ProductService.getAllProducts()
        req.io.emit('updatedProducts', products)
        return res.status(201).json({ status: 'success', payload: deletingProduct })
    }catch(err){
        res.status(500).json({ status: 'error', error: err.message })
    }
}