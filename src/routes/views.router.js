import { Router } from 'express'
import { 
    auth, 
    auth2, 
    auth3, 
    finishingShoppingController,
    renderCartWithProductsPlusInfoUserController, 
    renderFailLoginViewController, 
    renderFailRegisterViewController, 
    renderHomeViewController,
    renderLoginViewController,
    renderProductsWithPaginateController,
    renderRealTimeProductsViewController,
    renderRegisterViewController,
    renderUserErrorViewController
} from '../controllers/views.controller.js'

const viewsRouter = Router()

viewsRouter.get('/', auth , renderHomeViewController)
viewsRouter.get('/realTimeProducts', auth, renderRealTimeProductsViewController)
viewsRouter.get('/products', auth2, renderProductsWithPaginateController)
viewsRouter.get('/:cid/purchase', auth2, finishingShoppingController)
viewsRouter.get('/login', auth3, renderLoginViewController)
viewsRouter.get('/register', auth3, renderRegisterViewController)
viewsRouter.get('/userError', auth3, renderUserErrorViewController)
viewsRouter.get('/failRegister', auth3, renderFailRegisterViewController)
viewsRouter.get('/failLogin', auth3, renderFailLoginViewController)
viewsRouter.get('/carts/:cid', auth2, renderCartWithProductsPlusInfoUserController)

export default viewsRouter