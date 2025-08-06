import mongoose from 'mongoose'
import rooms from '../models/rooms.model.js'
import upload from '../services/uploadService.js'
import redisClient from '../services/redis.js'
import asyncWrapper from '../middleware/asyncWrapper.js'
import bookings from '../models/bookings.model.js'
import { Result , body } from 'express-validator'
import { ADDED_ROOM, ALL_ROOMS, DELETED_ROOM, NOT_EXISTED_ROOM, SINGLE_ROOM, UPDATED_ROOM } from '../utills/roomsManagementMessages.js'


export const AddRoom = async (req ,res)=>{

    console.log(req.files)
    try{
       const {hotel_id , room_number , type , price_per_night , description , isAvailable  } = req.body

       const existedRoom = await rooms.findOne({room_number : room_number})

      if(existedRoom){
          res.json({status : 400 , message : NOT_EXISTED_ROOM})
      }

    const imageUrls = await Promise.all(
       req.files.map((file) => upload(file.buffer))
    )


      const NewRoom = await new rooms({hotel_id , room_number , type , price_per_night , description , isAvailable , image : imageUrls })
 
      await NewRoom.save()
      return res.json({status : 201 , data : NewRoom , message : ADDED_ROOM})


    }catch(err){
        return res.json({status : 500 , message : err.message})
    }
    
}

export const GetAllRoomsHotel = async (req , res)=>{

    try{

      const {Hotel_id , type , isAvailable , country , city ,check_in_date , check_out_date} = req.query

      const AvailableRooms = await bookings.find({
        check_in_date : {$lt : new Date(check_out_date)},
        check_out_date : {$gt :new Date(check_in_date)}
      })

      const query = {}

 
      const cachKey = `rooms${JSON.stringify(query)}`


      const CachedData = await redisClient.get(cachKey)

      if(CachedData){
        return res.json({status : 200 , data : JSON.parse(CachedData) , message : ALL_ROOMS})
      }

      if(Hotel_id){
      
         query.hotel_id = new mongoose.Types.ObjectId(Hotel_id) 

      } 

      if(type){
        query.type = type.toLowerCase()
      }

      if(isAvailable){
        query.isAvailable = isAvailable === 'true'
      }

      if(country){
        query.country = country
      }
      if(city){
        query.city = city
      }

      console.log(query)

       const matchedRooms = await rooms.find(query)

      if(!matchedRooms.length){

        return res.json({status : 404 ,message : NOT_EXISTED_ROOM})

      }

      await redisClient.setEx(cachKey , 12000 , JSON.stringify(matchedRooms))

      return res.json({status : 200 , data : matchedRooms , ALL_ROOMS})
      }
      catch(err){
        return res.json({status : 500 , message : err.message})
      }

}


export const GetSingleRoom = async (req , res)=>{

    try{
  
        const roomId = req.params.id
  
        const cachKey = `rome${roomId}`

        const CachedData = await redisClient.get(cachKey)

        if(CachedData){
        return res.json({status : 200 , data : JSON.parse(CachedData), message : SINGLE_ROOM})
        }

        const singleRoom = await rooms.findOne({_id : roomId})

        if(!singleRoom){
           return res.json({status : 404 , message : NOT_EXISTED_ROOM})
    
        }

        await redisClient.setEx(cachKey , 12000 , JSON.stringify(singleRoom))

        return res.json({status : 200 , data : singleRoom , message : SINGLE_ROOM})

    }catch(err){
        return res.json({status : 500 , message : err.message}) 
    }
    


}

export const UpdateRoom = async (req , res )=>{

    try{
        
        const roomId = req.params.id

        const updatedData = req.body
        console.log(req.body)

        const cachKey = `room${roomId}`

        const updatedRoom = await rooms.findByIdAndUpdate(roomId , {$set : updatedData}, {new : true})

        await redisClient.del(cachKey)

        return res.json({status : 200 , data : updatedRoom , meesage : UPDATED_ROOM})

    }catch(err){
        return res.json({status : 500 , message : err.message})
    }

}

export const deleteRoom = async (req , res)=>{

    try{
        
        const roomId = req.params.id

        const cachKey = `room${roomId}`

        const existedRoom = await rooms.findById(roomId)

        if(!existedRoom){
            return res.json({status : 404 , message : NOT_EXISTED_ROOM})
        }

        const deletedRoom =await existedRoom.deleteOne()

        await redisClient.del(cachKey)

        return res.json({status : 200  , data : deletedRoom , message : DELETED_ROOM})
    }catch(err){
        return res.json({status : 500 , message : err.message})
    }

}