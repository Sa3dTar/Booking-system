import hotels from '../models/hotels.model.js'
import upload from '../services/uploadService.js'
import redisClient from '../services/redis.js'
import { Result , body } from 'express-validator'
import { ADDED_HOTEL, All_HOTELS, DELETED_HOTEL, EXISTED_HOTEL, NOT_EXISTED_HOTEL, NOT_IMAGE, SINGLE_HOTEL, UPDATED_HOTEL } from '../utills/hotelMessage.js'

export const AddHotel = async (req , res)=>{

    try{
      const {Name , address , city , country , phoneNumber } = req.body

      const oldHotel = await hotels.findOne({Name : Name})

      const image = req.file.buffer

      if(oldHotel){
        return res.json({status : 400 , message : EXISTED_HOTEL})
      }
      if(!image){
        return res.json({status : 400 , message : NOT_IMAGE})
      }

      const imageUrl = await upload(image)

      const newHotel =await hotels({Name ,address , city , country , phoneNumber ,image : imageUrl })
      console.log(newHotel)
      await newHotel.save()

      return res.json({status : 201 , data : newHotel , message : ADDED_HOTEL})
    }catch(err){
        return res.json({status : 500 , message : err.message})
    }
  
}

export const GetAllHotels = async (req , res)=>{

  // const query =  req.query

  // const pagination = req.si

  const AllHotels = await hotels.find()

  if(!AllHotels){

    return res.json({status : 404 , message : NOT_EXISTED_HOTEL})
  }

  const cachKey = 'All_hotels'

  const CachedData = await redisClient.get(cachKey)

  const JsonCachedData = JSON.parse(CachedData)

  if(CachedData){
    return res.json({status : 200 , data : JsonCachedData , message : All_HOTELS})
  }

  const CachingData = await redisClient.setEx(cachKey , 12000 , JSON.stringify(AllHotels))
 

  return res.json({status : 200 , data : AllHotels , message : All_HOTELS})

  

}


export const GetSingleHotel = async (req , res)=>{

  // const query =  req.query

  // const pagination = req.si

  const hotelId = req.params.id

  const singleHotel = await hotels.findById({_id : hotelId})

  if(!singleHotel){
    return res.json({status : 404 , message : NOT_EXISTED_HOTEL})
  }


  const CachedKey = `singleHotel${hotelId}`

  const CachedData = await redisClient.get(CachedKey)

  const JsonCachedData = JSON.parse(CachedData)

  if(CachedData){
    return res.json({status : 200 , data : JsonCachedData , message : SINGLE_HOTEL})
  }

  const CachingData = await redisClient.setEx(CachedKey , 12000 , JSON.stringify(singleHotel))

  return res.json({status : 200 , data : singleHotel , message : SINGLE_HOTEL})

}


export const updateHotel = async (req , res)=>{

  // const query =  req.query

  // const pagination = req.si

  const UpdatedData = req.body

  const hotelId = req.params.id

  const CachedKey = `hotel${hotelId}`

  const singleHotel = await hotels.findById({_id : hotelId})

  if(!singleHotel){
    return res.json({status : 404 , message : NOT_EXISTED_HOTEL})
  }

  const UpdatedHotel = await singleHotel.updateOne(UpdatedData)

  redisClient.del(CachedKey)


  return res.json({status : 200 , data : UpdatedHotel , message : UPDATED_HOTEL})

}



export const deleteHotel = async (req , res)=>{

  const hotelId = req.params.id

  const CachedKey = `hotel${hotelId}`


  const singleHotel = await hotels.findById({_id : hotelId})

  if (!singleHotel) {
      return res.status(404).json({ status: 404, message: NOT_EXISTED_HOTEL });
  }


  const deletedUser = await singleHotel.deleteOne()

  redisClient.del(CachedKey)

  return res.json({status : 200 , data : deletedUser , message : DELETED_HOTEL})

}


