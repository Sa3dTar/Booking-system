import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
import RegisterRoutes from './routes/Register.routes.js'
import LogRoutes from './routes/Log.routes.js'
import HotelsRoutes from './routes/hotel.routes.js'
import RoomsRoutes from './routes/room.routes.js'
import bookingRoutes from './routes/Booking.routes.js'
import ownerDashRoutes from './routes/hotelOwnerDash.routes.js'
import adminDashRoutes from './routes/adminDash.routes.js'
import cookieParser from 'cookie-parser'
import helmet from 'helmet'
import instance from './config/Database.js'

dotenv.config()

const app = express()



app.use(cors())
app.use(cookieParser())
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(helmet())



app.use('/api/register',RegisterRoutes)
app.use('/api/login',LogRoutes)
app.use('/api/hotels',HotelsRoutes)
app.use('/api/room',RoomsRoutes)
app.use('/api/booking',bookingRoutes)
app.use('/api/hotelownerdash', ownerDashRoutes )
app.use('/api/admindashboard',adminDashRoutes)

app.use((err , req, res, next)=>{
    res.status(500).json({message : err.message})
    
})

app.disable('x-powerde-by')


 
app.listen(process.env.PORT) 