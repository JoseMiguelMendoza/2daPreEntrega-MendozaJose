export default class TicketRepository {
    constructor(dao){
        this.dao = dao
    }
    createTicket = async(data) => await this.dao.createTicket(data)
}