import mongoose from "mongoose";

const reviewsSchema = mongoose.Schema({
    hotel_id :{
        type : mongoose.Schema.Types.ObjectId,
        ref : 'hotels',
        required : true
    },
    user_id : {
        type : mongoose.Schema.Types.ObjectId,
        ref : 'users',
        required: true
    },
    rating : {
        type : Number,
        enum : [1 , 2 , 3 , 4 , 5],
        required : true
    },
    comment : {
        type : String,
        required : true
    },
    created_at : {
        type : Date,
        required : true
    }
})

const reviews = mongoose.model('reviews', reviewsSchema)

export default reviews