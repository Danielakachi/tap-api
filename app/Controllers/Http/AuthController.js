'use strict'

const {validateAll} = use('Validator')
const User = use('App/Models/User')
const Client = use('App/Models/Client')
const Merchant = use('App/Models/Merchant')


class AuthController {
// async Register({request,response}){
//     //recieve data 
//     const data = request.only(['email','password']);

//     //add validation to data 
//     const validation = await validateAll(data, {
//         email :'required|email|unique:users',
//         password : 'required',

//     });

//     if(validation.fails()){
//         return response.status(400).json(
//             {messages: validation.messages() }
//         );

//     }

//     // Register user in db
//     const user = await User.create({...data});

//     // Register as client
//     // Register as merchant


//     return response.status(200).json({message: 'Account Created',user });
// }

async RegisterClient({request,response}){
     const data = request.only(['email','password','firstname','lastname']);

     const validation =await  validateAll(data , {
        email :'required|email|unique:users',
        firstname :'required',
        lastname :'required',
        password : 'required',
     })

     if (validation.fails()){
         return response.status(400).json({
             message:validation.messages()
         })
     }


     const {email,password} =data
     const new_data = {
         email,
         password
     }
     // Register user in user table
     const user = await User.create({...new_data});

     // collect id of user
     const {id:user_id} = user;
     const {firstname,lastname}= data

     //make object for client details
     const client_data = {user_id,firstname,lastname}
     const balance = 0;
     
     //register user in client table
     const client = await Client.create({...client_data,balance})

     return response.status(200).json({
         message:'Account Created'
     })


}

async RegisterMerchant({request,response}){
    const data = request.only(['email','password','company_name']);

    const validation =await  validateAll(data , {
        email :'required|email|unique:users',
        company_name :'required',
     })

     if (validation.fails()){
        return response.status(400).json({
            message:validation.messages()
        })
    }

    const {email,password} = data;
    const new_data = {email,password}

    // Register user in user table
    const user = await User.create({...new_data});

    // collect id of user 
    const {id:user_id} = user
    const {company_name} = data

    // make object for Merchant details
    const merchant_id = {user_id,company_name}
    const balance = 0;

    const merchant = await Merchant.create({...merchant_id,balance})
    console.log(merchant)

    return response.status(200).json({
        message:'Account Created'
    })


}
async Login ({request,auth,response}){
    const  {email, password} = request.all()
    const { token } = await auth.attempt(email,password);

    return response.status(200).json({message: 'Logged in', token});

}


}

module.exports = AuthController
