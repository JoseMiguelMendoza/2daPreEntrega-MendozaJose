import { UserService } from '../services/index.js'
import UserDTO from '../dto/Users.js'

export const redirectionRegisterController = async(req, res) => {
    res.redirect('/login')
} 

export const redirectionLoginController = async (req, res) => {
    const userId = req.session.passport.user
    const user = await UserService.findUserById(userId)
    if(user.role === 'Administrador/a'){
        return res.redirect('/realTimeProducts')
    }
    if(user.role === 'Usuario/a'){
        return res.redirect('/products')
    }
}

export const destroyingSessionController = (req, res) => {
    req.session.destroy(err => {
        if(err) {
            console.log(err);
            return res.redirect('/userError')
        } else return res.redirect('/login')
    })
}

export const redirectionGithubController = async(req, res) => {
    req.session.user = req.user
    return res.redirect('/products')
}

export const userCompleteInfoController = async(req, res) => {
    if(!req.session.passport) return res.status(401).json({
        status: 'error',
        error: 'No session detected.'
    })
    let user_data = await UserService.findUserById(req.session.passport.user)
    return res.status(200).json({ status: 'success', 
    // payload: {
    //     ID_USER: req.session.passport.user,
    //     USER_DATA: {
    //         name: user_data.name,
    //         surname: user_data.surname,
    //         email: user_data.email,
    //         age: user_data.age,
    //         ID_cart: user_data.cart
    //     }
    // }
    payload: new UserDTO(user_data)
})
}