 import bookings from '../models/bookings.model.js'
 import rooms  from '../models/rooms.model.js'
import redisClient from '../services/redis.js'
import  createPaymobIntent  from '../services/Paymob.js'
import { Result , body } from 'express-validator'
import { BILLING , BOOKEDSUCCESS, DATA, DELETEDBOOK, FAILED_PAYMENT, NOT_AVAILABLE_ROOM, SINGLEROOM, UPDATEDBOOK } from '../utills/BookingMessages.js'

 export const AddBookingAndPay = async (req , res)=>{



    const {user_id , room_id , price_per_night , check_in_date , check_out_date , billingInfo  } = req.body


    if (!billingInfo) {
       return res.status(400).json({ message: BILLING  });
    }
 
    const {
       email,
       phone,
       first_name,
       last_name,
       street,
       building,
       floor,
       apartment,
       state,
       country
    } = billingInfo;


    const newCheckIn = new Date(check_in_date)
    const newCheckOut = new Date(check_out_date)

    if(newCheckIn >= newCheckOut){
        return res.json({status : 400 , message : DATA})
    }

    const room = rooms.findById(room_id)

    const loopingBookings = await bookings.find({
        room_id ,
        check_in_date : {$lt : newCheckOut},
        check_out_date : {$gt : newCheckIn}
    })

    if(loopingBookings.length > 0){
        return res.json({status : 400 , message : NOT_AVAILABLE_ROOM})
    }


    const diffDate = newCheckOut - newCheckIn

    const millisecondsPerDay = 1000 * 60 * 60 * 24;

    const Days = Math.ceil(diffDate / millisecondsPerDay)

    const totalPrice = Days * room.price_per_night




    const result = createPaymobIntent({
        amount : totalPrice * 100,
        name : 'Room Booking',
        description :`Booking from ${check_in_date} to ${check_out_date}`,
        email : email ,
        phone : phone,
        first_name: first_name,
        last_name: last_name,
        street: street,
        building: building,
        floor: floor,
        apartment: apartment,
        state: state,
        country: country

    })

    if (!result.redirect_url) {
      return res.status(400).json({ message: FAILED_PAYMENT, details: result });
    }


    const newBooking = await new bookings({user_id , room_id , price_per_night , check_in_date : newCheckIn , check_out_date : newCheckOut ,total_price : totalPrice })

    await newBooking.save()

     await room.updateOne({isAvailable : false})

     await room.save()

     const currentDate = new Date()

     if(newBooking.check_out_date < currentDate){
        await room.updateOne({isAvailable : true})
     }

    return res.json({status : 200 , data : newBooking , message :BOOKEDSUCCESS})

 }


export const GetSingleBooking = async (req , res)=>{
   
    const BookingId = req.params.id

    const CachKey = `Booking${BookingId}`

    const CachedData =await redisClient.get(CachKey)

    if(CachedData){
        return res.json({status : 200 , data : JSON.parse(CachedData)})
    }

    const SingleBooking = await bookings.findById(BookingId)
    
    await redisClient.setEx(CachKey , 12000 , JSON.stringify(SingleBooking))

    return res.json({status : 200 , data : SingleBooking , message : SINGLEROOM})


}

export const UpdateBooking = async (req , res)=>{

    const BookingId = req.params.id

    const updatedData = req.body

    const UpdatedBooking = await bookings.findByIdAndUpdate({_id : BookingId},{$set : updatedData},{new : true})

    return res.json({status : 200 , data : UpdatedBooking , message : UPDATEDBOOK})


}

export const DeleteBooking = async (req ,res)=>{
     
    const BookingId = req.params.id

    const SingleBooking = await bookings.findById(BookingId)

    const DeletedBooking = await SingleBooking.deleteOne()

    return res.json({status : 200 , data : DeletedBooking , message : DELETEDBOOK})
   
}