import rooms from "../models/rooms.model.js";
import bookings from "../models/bookings.model.js";
import hotels from '../models/hotels.model.js'
import mongoose from "mongoose";
import HOTEL_OWNER from '../utills/hotelOwnerDashboardMessages.js'

 const GetData = async (req , res)=>{

    const hotelId = req.params.id

    const Today = new Date()

    const StartOfDay = new Date(Today.setHours(0 , 0 ,0 ,0))

    const endOfDay = new Date(Today.setHours(23 , 59 ,59 ,999))

    const SingleRooms = await rooms.countDocuments({ hotel_id :new mongoose.Types.ObjectId(hotelId) ,type : 'single' })

    const SingleRoomBooked = await rooms.countDocuments({ hotel_id :new mongoose.Types.ObjectId(hotelId) ,type : 'single' , isAvailable : false})

    const DoubleRooms = await rooms.countDocuments({ hotel_id :new mongoose.Types.ObjectId(hotelId) ,type : 'double'})

    const BookedDoubleRooms = await rooms.countDocuments({hotel_id :new mongoose.Types.ObjectId(hotelId) , type : 'double',isAvailable : false})

    const Suits = await rooms.countDocuments({hotel_id :new mongoose.Types.ObjectId(hotelId), type : 'suit'})

    const BookedSuits = await rooms.countDocuments({hotel_id :new mongoose.Types.ObjectId(hotelId) , type : 'suit', isAvailable : false})

    const totalBookingsOfDay = await bookings.countDocuments({hotel_id :new mongoose.Types.ObjectId(hotelId), date : {$gt :StartOfDay , $lt : endOfDay }})

    return res.json({status : 200 , data : {SingleRooms , SingleRoomBooked , DoubleRooms , BookedDoubleRooms , Suits , BookedSuits , totalBookingsOfDay} , message : HOTEL_OWNER })






}

export default GetData