import jwt from 'jsonwebtoken'
import dotenv from 'dotenv'
dotenv.config()

export const userstoken = (payload)=>{

    const token = jwt.sign(payload , process.env.JWT_SECRET_KEY , {expiresIn : '1y'})

    return token

}
export const refreshUsersToken = (payload)=>{

   const token = jwt.sign(payload , process.env.REFRESH_JWT_SECRET_KEY , {expiresIn : '7d'})

   return token

}

