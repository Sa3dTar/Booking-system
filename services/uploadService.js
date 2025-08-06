import { v2 as cloudinary } from 'cloudinary';
import dotenv from 'dotenv'
import { Result } from 'express-validator';
import streamifier from 'streamifier';
dotenv.config()



cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.API_KEY,
  api_secret: process.env.API_SECRET,
});


const upload = async (image)=>{
  return new Promise((resolve , reject)=>{
    const stream = cloudinary.uploader.upload_stream(
      (err , result)=>{
        if(err){
          return reject(err)
        }
        resolve(result.secure_url)
      }
    )
    streamifier.createReadStream(image).pipe(stream)
  })
}

export default upload