 import bookings from '../models/bookings.model.js'
 import mongoose from 'mongoose'
 import rooms from '../models/rooms.model.js'
 import users from '../models/users.model.js'
 import dotenv from 'dotenv'
 import redisClient from '../services/redis.js'
 
 dotenv.config()


export const GetAllBooking = async (req , res )=>{


    try{
            const CachKey = 'all_bookings'

            const cachedData =await redisClient.get(CachKey)

            if(cachedData){
               return res.json({status : 200 , data : JSON.parse(cachedData)})
            }

            const AllBookings = await bookings.find()

            if(!AllBookings){
               return res.json({status : 404 , message : 'there is no booking'})
            }

            await redisClient.setEx(CachKey , 12000 , JSON.stringify(AllBookings))

            return res.json({status : 200 , data : AllBookings})

     }catch(err){
        console.log(err)
        return res.json({status : 500 , message : err?.message})
     }

 

}


export const GetAllRoomsHotel = async (req , res)=>{

    try{

      const {Hotel_id , type , isAvailable , country , city ,check_in_date , check_out_date} = req.query

      const query = {}

 
      const cachKey = `rooms${JSON.stringify(query)}`


      const CachedData = await redisClient.get(cachKey)

      if(CachedData){
        return res.json({status : 200 , data : JSON.parse(CachedData)})
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

        return res.json({status : 404 ,message : 'there is no room exist'})

      }

      await redisClient.setEx(cachKey , 12000 , JSON.stringify(matchedRooms))

      return res.json({status : 200 , data : matchedRooms})
      }
      catch(err){
        return res.json({status : 500 , message : err.message})
      }

}

export const GetAllUSers = async (req ,res)=>{
  
    try{
        const cachKey = 'All_users'

        const cached =await redisClient.get(cachKey)

        const allUsers =await users.find()

        const cachedUsers = JSON.parse(cached)

       if(cached){
          return res.json({status : 200 , data : cachedUsers})
       }

       if(!allUsers){
           return res.json({status : 404 , message : 'users not found'})
        }

       await redisClient.setEx(cachKey , 1200, JSON.stringify(allUsers))

       return res.json({status : 200 , data : allUsers})
    }catch(err){
        return res.json({status : 500 , message : err.message})
    }

}
export const getSingleUSer = async (req , res)=>{

    try{

            const userId = req.params.id
  
            const CachKey = `user${userId}`

            const cachedData = await redisClient.get(CachKey)

            if(cachedData){
               return res.json({status : 200 , data : JSON.parse(cachedData)})
            }
            const singleUSer = await users.findOne({_id : userId})

            await redisClient.setEx(CachKey ,12000,JSON.stringify(singleUSer) )

            if(!singleUSer){
               return res.json({status : 404 , message : 'user not found'})
            }

           return res.json({status : 200 , data : singleUSer})

    }catch(err){
        return res.json({status : 500 , message : err.message})
    }

}
