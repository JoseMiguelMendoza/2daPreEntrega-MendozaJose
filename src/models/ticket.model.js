import mongoose from "mongoose";
import { nanoid } from "nanoid";

const ticketSchema = new mongoose.Schema({
    code: {
        type: String, 
        unique: true, 
        required: true,
        default: () => nanoid(15)
    },
    purchase_datetime: { type: Date, default: Date.now },
    ammount: {type: Number},
    purchaser: {type: String, required: true},
    products: [{
        _id: false,
        product: { 
            type: mongoose.Schema.Types.ObjectId, 
            ref: 'products' 
        },
        quantity: { type: Number }
    }]
})

mongoose.set('strictQuery', false)
const ticketModel = mongoose.model('tickets', ticketSchema)

export default ticketModel