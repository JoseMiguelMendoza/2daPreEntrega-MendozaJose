import fs from 'fs'
import { nanoid } from 'nanoid'
import ProductManager from './ProductManager.js'

const productManager = new ProductManager("./src/models/products.json") 

export default class CartManager{
    #format
    constructor(path){
        this.path = path
        this.#format = 'utf-8'
    }

    exist = async(id) => {
        let carts = await this.readCarts()
        return carts.find(cart => cart.id == id)
    }

    // Intente usar el generateId de ProductManager.js, le cambie los nombres de products a cart, y me salian los id= 1 y id=2, pero al llegar al id = 2, al crear un carrito más, salia con id = 2, y asi con los siguientes. Usé nanoid para sacarme ese problema de encima.
    
    readCarts = async() => {
        let readingCarts = await fs.promises.readFile(this.path, this.#format)
        return JSON.parse(readingCarts)
    }

    getCarts = async() => {
        return await this.readCarts()
    }

    writeCarts = async(cart) => {
        await fs.promises.writeFile(this.path, JSON.stringify(cart, null, '\t'))
    }

    addCarts = async(cart) => {
        let cartsOld = await this.readCarts()
        // puse cart.id = this.#generateId(cartsOld) <-- no funcionó.
        let cartId = nanoid(5) 
        cart = {id: cartId, products: []}
        let allCarts = [cart, ...cartsOld]
        return await this.writeCarts(allCarts)
    }


    getCartsById = async(id) => {
        let cartById = await this.exist(id)
        return cartById
    }

    addProductInCart = async(cartId, productId) => {
        let cartById = await this.exist(cartId)
        if(!cartById) return "Carrito no encontrado" // añadir mensaje de status.json
        let productById = await productManager.exist(productId)
        if(!productById) return "Producto no encontrado" // añadir mensaje de status.json tambien
        let carts = await this.readCarts()
        let cartFilter = carts.filter(cart => cart.id != cartId)

        if(cartById.products.some(prod => prod.id == productId)){
            let moreProductInCart = cartById.products.find(prod => prod.id == productId)
            moreProductInCart.quantity++;
            let cartsConcat = [cartById, ...cartFilter]
            await this.writeCarts(cartsConcat)
            return "Producto sumado al carrito." // añadir mensaje de status.json
        }
        cartById.products.push({id: productById.id, quantity: 1})
        let cartsConcat = [cartById, ...cartFilter]
        await this.writeCarts(cartsConcat)
        return "Producto agregado al carrito." //añadir mensaje de status.json
    }
}