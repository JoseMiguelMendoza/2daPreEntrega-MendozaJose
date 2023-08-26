import userModel from '../models/user.model.js'

export default class UserDAO {
    findUserById = async(data) => await userModel.findById(data)
}