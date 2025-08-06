import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
dotenv.config() 

export const VerifyAdminToken = (req , res , next)=>{

    const AuthHeader = req.headers['authorization'] || req.headers['AUTHORIZATION']

    if(!AuthHeader){

        return res.json({status : 404 , message : 'token is expired'})

    }

    const token = AuthHeader.split(' ')[1]

    const currentAdmin = jwt.verify(token , process.env.JWT_SECRET_KEY)

    if(currentAdmin.role = 'admin'){

        req.adminId === currentAdmin._id

    }

    next()
}
export const VerifyUserToken = (req , res , next)=>{

    const AuthHeader = req.headers['authorization'] || req.headers['AUTHORIZATION']

    if(!AuthHeader){

        return res.json({status : 404 , message : 'token is expired'})

    }

    const token = AuthHeader.split(' ')[1]

    const currentUser = jwt.verify(token , process.env.JWT_SECRET_KEY)

    if(currentUser.role = 'user' ){

        req.UserId === currentUser._id

    }

    next()
}
export const VerifyOwnerToken = (req , res , next)=>{

    const AuthHeader = req.headers['authorization'] || req.headers['AUTHORIZATION']

    if(!AuthHeader){

        return res.json({status : 404 , message : 'token is expired'})

    }

    const token = AuthHeader.split(' ')[1]

    const currentOwner = jwt.verify(token , process.env.JWT_SECRET_KEY)

    if(currentOwner.role = 'owner'){

        req.ownerId === currentOwner._id

    }

    next()
}
export const VerifyToken = (req , res , next)=>{

   const AuthHeader = req.headers['authorization'] || req.headers['AUTHORIZATION']

    if(!AuthHeader){

        return res.json({status : 404 , message : 'token is expired'})

    }

    const token = AuthHeader.split(' ')[1]

    const currentUSer = jwt.verify(token , process.env.JWT_SECRET_KEY)

    next()
}