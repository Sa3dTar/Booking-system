import mongoose from "mongoose";
import dotenv from 'dotenv'
dotenv.config()

class DataBase{
    constructor(){
        this.connect =  mongoose.connect(process.env.MONGODB_URL);
        
    }

    getInstance() {
         const instance = this.connect;
         return instance
    }
}

const newDB = new DataBase()

const instance = newDB.getInstance()

export default instance
