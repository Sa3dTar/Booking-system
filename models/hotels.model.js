import mongoose from "mongoose";

const hotelsSchema = mongoose.Schema({
    Name : {
        type : String,
        required: true
    },
    address : {
        type : String,
        required : true
    },
    city : {
        type : String,
        required : true
    },
    country : {
        type : String,
        required : true
    },
    phoneNumber : {
        type : String,
        required : true
    },
    image : {
        type : String,
        required : true
    }
})

const hotels = mongoose.model('hotels', hotelsSchema)

export default hotels