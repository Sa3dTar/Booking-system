import mongoose from "mongoose";

const bookingsSchema = mongoose.Schema({
    user_id : {
        type : mongoose.Schema.Types.ObjectId,
        ref : 'users',
        required: true
    },
    room_id : {
        type : mongoose.Schema.Types.ObjectId,
        ref : 'rooms',
        required : true
    },
    price_per_night : {
        type : Number,
        required : true
    },
    check_in_date : {
        type : Date,
        required : true
    },
    check_out_date : {
        type : Date,
        required : true
    },
    total_price : {
        type : Number,
        required : true
    }
})

const bookings = mongoose.model('booking', bookingsSchema)

export default bookings