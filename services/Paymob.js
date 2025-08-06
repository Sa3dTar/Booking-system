import fetch from 'node-fetch';
import dotenv from 'dotenv'
dotenv.config()

const iFtameId = process.env.IFRAME_ID
const PAYMOB_TOKEN =process.env.PAYMOB_API_KEY ; 
const INTEGRATION_ID = process.env.INTEGERATION_ID;           
const CURRENCY = 'EGP';

 const createPaymobIntent = async (data) => {
  const {
    amount,
    name,
    description,
    email,
    phone,
    first_name,
    last_name,
    street,
    building,
    floor,
    apartment,
    state,
    country
  } = data;

  const body = {
    amount,
    currency: CURRENCY,
    payment_methods: [INTEGRATION_ID],
    items: [
      {
        name,
        amount,
        description,
        quantity: 1
      }
    ],
    billing_data: {
      apartment: apartment || 'NA',
      first_name,
      last_name,
      street,
      building: building || 'NA',
      phone_number: phone,
      country: country || 'EG',
      email,
      floor: floor || 'NA',
      state: state || 'NA'
    },
    customer: {
      first_name,
      last_name,
      email
    }
  };

  const response = await fetch('https://accept.paymob.com/v1/intention/', {
    method: 'POST',
    headers: {
      'Authorization': PAYMOB_TOKEN,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(body)
  });

  const result = await response.json();
  return result;
};


export default createPaymobIntent