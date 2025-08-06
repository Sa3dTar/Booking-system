import users from '../../models/users.model.js'
import upload from '../../services/uploadService.js'
import { userstoken , refreshUsersToken } from '../../middleware/generateJwt.js'
import cookieParser from 'cookie-parser'
import dotenv from 'dotenv'
import redisClient from '../../services/redis.js'
import bcrypt from 'bcrypt';
import { Result , body } from 'express-validator'
dotenv.config()


export const Login = async (req , res)=>{

    try{
        const { email , password } = req.body

      const existedUSer = await users.findOne({email : email})


      if(!existedUSer){
        return res.json({ status: 400, message: 'Invalid email' });
      }

      const ComparedPassword = await bcrypt.compare(password , existedUSer.password)

      if (!ComparedPassword) {
      return res.json({ status: 400, message: 'Invalid password' });
      }

      
        const token = userstoken({id : existedUSer._id ,email : existedUSer.email , role : existedUSer.role})
        const refreshToken = refreshUsersToken({id : existedUSer._id ,email : existedUSer.email , role : existedUSer.role})

        res.cookie('refreshToken', refreshToken, {
           httpOnly : true,
           sameSite : 'strict',
           secure : process.env.NODE_ENV === 'production',
           maxAge : 7 * 24 * 60 * 60 * 1000 
        });

       

      console.log(token)
    
      return res.json({status : 201 , message : 'logged in successfully'})

      }catch(err){
        return res.json({status: 500 , message : err.message})
      }
}