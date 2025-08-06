import  {validationResult , body}  from "express-validator";

export const  userSchema = [
    body('Name').
    notEmpty().
    withMessage('name is required').
    isLength({min : 3}).
    withMessage('the minimum length is 3 letters'),
    body('email').
    isEmail().
    notEmpty().
    withMessage('the email is required'),
    body('password').
    notEmpty().
    withMessage('the password is required').
    isLength({min : 7}).
    withMessage('the minimum length is 7 characters'),
    body('phonenumber').
    notEmpty().
    withMessage('the phone number is required')
]

export const hotelSchema =[
    body('Name').
    notEmpty().
    withMessage('name is required'),
    body('address')
    .notEmpty()
    .withMessage('address is required'),
    body('city')
    .notEmpty()
    .withMessage('city is required'),
    body('country')
    .notEmpty()
    .withMessage('country is required'),
    body('phonenumber')
    .notEmpty()
    .withMessage('phonenumber is required')
    
]

export const roomSchema = [
    body('room_number')
    .notEmpty()
    .withMessage('room number is required'),
    body('type')
    .notEmpty()
    .withMessage('type is required'),
    body('price_per_night')
    .notEmpty()
    .withMessage('price per night is required'),
    body('description')
    .notEmpty()
    .withMessage('description is required'),
]
