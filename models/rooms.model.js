import mongoose from "mongoose";

const roomsSchema = mongoose.Schema({
    hotel_id :{
        type : mongoose.Schema.Types.ObjectId,
        ref : 'hotels',
        required : true
    },
    room_number : {
        type : Number,
        unique : true,
        required: true
    },
    type : {
        type : String,
        enum : ['single' , 'double' , 'suite'],
        required : true
    },
    price_per_night : {
        type : Number,
        required : true
    },
    description : {
        type : String,
        required : true
    },
    isAvailable : {
        type : Boolean,
        default : true,
        required : true
    },
    image : {
        type : [String],
        required : true
    }
})

const rooms = mongoose.model('rooms', roomsSchema)

export default rooms