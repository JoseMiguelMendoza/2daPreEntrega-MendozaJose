import mongoose from "mongoose";
import { nanoid } from "nanoid";

const ticketSchema = new mongoose.Schema({
    code: {
        type: String, 
        unique: true, 
        required: true,
        default: () => nanoid(15)
    },
    purchase_datetime: 'created_at',
    ammount: {type: Number},
    purchaser: {type: String, required: true}
})

mongoose.set('strictQuery', false)
const ticketModel = mongoose.model('tickets', ticketSchema)

export default ticketModel