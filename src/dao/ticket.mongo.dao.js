import ticketModel from '../models/ticket.model.js'

export default class TicketDAO {
    createTicket = async(data) => await ticketModel.create(data)
}