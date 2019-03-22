'use strict'
const User = use("App/Models/User")
const Client = use("App/Models/Client")
const Deposit = use("App/Models/Deposit")
const Transfer = use("App/Models/Transfer")
const Env = use('Env');
const { validateAll } = use('Validator');

const sk = Env.get('PAYSTACK_SECRET_KEY')
const Paystack = require('paystack-api')(sk);

class ClientController {
 async SetPin({request,response,auth}){

 }
 async changePin({request,response,auth}){
  const data = request.only(["current_pin","new_pin"]);

  const validation = await  validateAll(data , {
      current_pin :'required',
      new_pin:'required'
  })

  if (validation.fails()){
    return response.status(400).json({
        message:validation.messages()
    })
 }

 const {current_pin,new_pin} =data
 //get current pin in db
 const {id} = await auth.getUser()
 const {pin:pin_from_client_db}= await Client.findBy('user_id',id)
 
 
 
 //Compare
 if(pin_from_client_db != current_pin){
    return response.status(400).json({
        message:"Invalid Pin"
    })
 }

if((new_pin).length <4 || (new_pin).length >4 ){
    return response.status(400).json({
        message:"Pin must be 4 digit"
}) }


 
 //Update
 await Client.query().where("user_id",id).update({pin:new_pin})
 
 return response.status(200).json({
    message:"Pin successfully changed !"
})

   }

  async getHistory({response,auth}){
    const user = await auth.getUser()

    const deposits = await  user.deposits()..orderBy('created_at','desc').fetch()
    const transfers = await Transfer.query().where("sender_id",user.id)..orderBy('created_at','desc').fetch()
    

    return response.status(200).json({
        deposits,transfers
   })
  }

  
}



module.exports = ClientController;
