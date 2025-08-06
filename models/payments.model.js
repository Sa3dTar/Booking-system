import mongoose from "mongoose";

const paymentsSchema = mongoose.Schema({
    booking_id : {
        type : mongoose.Schema.Types.ObjectId,
        ref : 'bookings',
        required: true
    },
    amount : {
        type : Number,
        required : true
    },
    paymentMethod : {
        type : String,
        enum : ['card', 'cash'],
        required : true
    },
    payment_status : {
        type : String,
        enum : ['pending', 'paid', 'failed'],
        default : 'pending',
        required : true
    },
    paid_at : {
        type : Date,
        required : true
    }
})

const payments = mongoose.model('payments', paymentsSchema)

export default paymentsSchema