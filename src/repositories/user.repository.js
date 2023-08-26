export default class UserRepository {
    constructor(dao){
        this.dao = dao
    }
    findUserById = async(data) => await this.dao.findUserById(data)
}