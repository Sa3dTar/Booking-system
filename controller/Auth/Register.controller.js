import users from '../../models/users.model.js'
import upload from '../../services/uploadService.js'
import { userstoken , refreshUsersToken } from '../../middleware/generateJwt.js'
import cookieParser from 'cookie-parser'
import dotenv from 'dotenv'
import redisClient from '../../services/redis.js'
import bcrypt from 'bcrypt'
import { body , Result } from 'express-validator'
import { DELETED_USER, NOT_EXISTED_USER, NOT_EXISTED_USERS, REGISTERD, SINGLE_USER, UPDATED_USER, USERS } from '../../utills/AuthMessages.js'


dotenv.config()

export const addUser = async (req , res)=>{

    try{
        const {Name , email , password , phoneNumber , role} = req.body

       const image = req.file.buffer

      const existedUSer = await users.findOne({email : email})

       if(existedUSer){
          return res.json({status : 400 , message : NOT_EXISTED_USER})
       }

           const imageUrl =await upload(image)

           const hashedPassword = await bcrypt.hash(password , 10)


      const AddUser = await users({Name , email , password : hashedPassword , phoneNumber , role , image : imageUrl})


      const token = userstoken({id : AddUser._id , email : AddUser.email , role : AddUser.role})
      const refreshToken = refreshUsersToken({id : AddUser._id , email : AddUser.email , role : AddUser.role})
      console.log(token)

      res.cookie('refreshToken',refreshToken,{
          httpOnly : true,
          stateSite : 'strict',
          secure : process.env.NODE_ENV,
          maxAge: 7 * 24 * 60 * 60 
      })
    
      await AddUser.save()

      return res.json({status : 201 , message : REGISTERD})

      }catch(err){
        return res.json({status: 500 , message : err.message})
      }
}

export const GetAllUSers = async (req ,res)=>{
  
    try{
        const cachKey = 'All_users'

        const cached =await redisClient.get(cachKey)

        const allUsers =await users.find()

        const cachedUsers = JSON.parse(cached)

       if(cached){
          return res.json({status : 200 , data : cachedUsers , message : USERS})
       }

       if(!allUsers){
           return res.json({status : 404 , message : NOT_EXISTED_USERS })
        }

       await redisClient.setEx(cachKey , 1200, JSON.stringify(allUsers))

       return res.json({status : 200 , data : allUsers , message : USERS})
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
               return res.json({status : 200 , data : JSON.parse(cachedData), message : SINGLE_USER})
            }
            const singleUSer = await users.findOne({_id : userId})

            await redisClient.setEx(CachKey ,12000,JSON.stringify(singleUSer) )

            if(!singleUSer){
               return res.json({status : 404 , message : NOT_EXISTED_USER})
            }

           return res.json({status : 200 , data : singleUSer , message : SINGLE_USER})

    }catch(err){
        return res.json({status : 500 , message : err.message})
    }

}

export const UpdateUser = async (req , res)=>{

    try{
            const userId = req.params.id
    
            const singleUser = await users.findById({_id : userId})

            const updateData = req.body

            if(!singleUser){
                return res.json({status : 404, message : NOT_EXISTED_USER})
            }

           const UpdatedUser = await singleUser.updateOne(updateData)

           const cachKey = `user${userId}`

           await redisClient.del(cachKey)

           return res.json({status : 201 , data: UpdatedUser , message : UPDATED_USER})

    }catch(err){
        return res.json({status : 500})
    }
}

export const deletUser = async (req , res)=>{

    try{
            const userId = req.params.id
   
            const singleUser = await users.findById({_id : userId})

            const deletedUser =await singleUser.deleteOne()

            const cachKey = `user${userId}`

            await redisClient.del(cachKey) 

            return res.json({status : 200 , data : deletedUser , message : DELETED_USER})
    }catch(err){
        return res.json({status : 500 ,message : err.message})
    }

}