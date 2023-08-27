import { CartService, ProductService, UserService } from "../services/index.js"

export const auth = async(req, res, next) => {
    if(!req.session?.passport){
        return res.render('userError', {
            title: 'Error',
            statusCode: 403,
            error: 'There is no user logged-in.',
            user: false
        })
    }
    const user = await UserService.findUserById(req.session.passport.user)
    if(user.role === "Administrador/a") {
        return next()
    }
    return res.render('userError', {
        title: 'Not Admin',
        statusCode: 403,
        error: 'Only avaiable for Administrators.',
        user: req.session.passport.user ? true : false,
        userRole: user.role === 'Administrador/a' ? true : false
    })
}

export const auth2 = async(req, res, next) => {
    if(!req.session?.passport){
        return res.render('userError', {
            title: 'Error',
            statusCode: 403,
            error: 'There is no user logged-in.',
            user: false
        })
    }
    
    const user = await UserService.findUserById(req.session.passport.user)
    if(user.role === "Usuario/a") {
        return next()
    }else{
        return res.render('userError', {
            title: 'Not a User',
            statusCode: 403,
            error: 'Only avaiable for Users.',
            user: req.session.passport.user ? true : false,
            userRole: user.role === 'Administrador/a' ? true : false
        })
    }
}

export const auth3 = async(req, res, next) => {
    if(!req.session?.passport){
        return next()
    }
    const user = await UserService.findUserById(req.session.passport.user)
    console.log(user)
    if(user.role === 'Administrador/a'){
        return res.redirect('/realTimeProducts')
    }
    if(user.role === 'Usuario/a'){
        return res.redirect('/products')
    }
}

export const renderHomeViewController = async(req, res) => {
    const result = await ProductService.getAllPaginatedProducts(req)
    const user = await UserService.findUserById(req.session.passport.user)
    res.render('home', {
        title: "Programación backEnd | Handlebars",
        products: result,
        name: user.name,
        role: user.role,
        checkingRole: user.role === 'Administrador/a' ? true : false,
        products: result.response.payload,
        paginateInfo : {
            hasPrevPage: result.response.hasPrevPage,
            hasNextPage: result.response.hasNextPage,
            prevLink: result.response.prevLink,
            nextLink: result.response.nextLink
        }
    })
}

export const renderRealTimeProductsViewController = async(req, res) => {
    const user = await UserService.findUserById(req.session.passport.user)
    res.render('realTimeProducts', {
        title: "Handlebars | Websocket",
        products: await ProductService.getAllProducts(),
        name: user.name,
        role: user.role,
        checkingRole: user.role === 'Administrador/a' ? true : false,
    })
}

export const renderProductsWithPaginateController = async(req, res) => {
    const result = await ProductService.getAllPaginatedProducts(req)
    const user = await UserService.findUserById(req.session.passport.user)
    res.render('products', {
        title: 'Paginate | Handlebars',
        products: result.response.payload,
        paginateInfo : {
            hasPrevPage: result.response.hasPrevPage,
            hasNextPage: result.response.hasNextPage,
            prevLink: result.response.prevLink,
            nextLink: result.response.nextLink
        },
        name: user.name,
        role: user.role,
        cid: user.cart
    })
}

export const finishingShoppingController = async(req, res) => {
    let cartId = req.params.cid
    let productsInCart = await CartService.getProductsFromCart(req, res)
    let totalCartPrice = 0;
    let totalPrice = 0;

    const cartDataWithAvailability = productsInCart.products.map(item => {
        const isAvailable = item.product.stock - item.quantity > 0;
        if(isAvailable){
            totalPrice = item.product.price * item.quantity;
            totalCartPrice  += totalPrice;
        }
        else{
            totalPrice = item.product.price * item.quantity
        }

        return {
            ...item,
            isAvailable: isAvailable,
            totalPrice: totalPrice
        };
    });

    res.render('purchase', {
        cart_data: cartDataWithAvailability,
        total_price: totalCartPrice,
        cid: cartId
    })
}

export const renderLoginViewController = (req, res) => {
    res.render('login', {
        title: 'Login - Iniciar sesión'
    })
}

export const renderRegisterViewController = (req, res) => {
    res.render('register', {
        title: 'Registrarse'
    })
}

export const renderUserErrorViewController = (req, res) => {
    res.render('userError', {
        title: 'Error',
        error: 'An error has ocurred. Do not enter this link.',
        user: req.session.passport.user ? true : false
    })
}

export const renderFailRegisterViewController = (req, res) => {
    res.render('userError', {
        title: 'Error',
        error: 'Email already exists or you did not complete all the fields or register failed.',
        statusCode: 401,
        user: false
    })
}

export const renderFailLoginViewController = (req, res) => {
    res.render('userError', {
        title: 'Error',
        error: 'User not found or incorrect password, please check carefully again.',
        statusCode: 401,
        user: false
    })
}

export const renderCartWithProductsPlusInfoUserController = async(req, res) =>{
    try{
        let cid = req.params.cid
        let cartById = await CartService.productsPopulated(cid)
        const user = await UserService.findUserById(req.session.passport.user)
        if(cartById === null){
            return res.status(404).json({ status: 'error', error: 'Not Found'})
        }
        res.render('cart', {
            title: 'Carrito',
            cid: user.cart,
            products: cartById.products,
            name: user.name,
            role: user.role,
            checkingRole: user.role === 'Administrador/a' ? true : false
        })
    }catch(err){
        res.status(500).json({ status: 'error', error: err.message })
    }
}