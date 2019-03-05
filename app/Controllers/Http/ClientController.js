'use strict'
const User = use("App/Models/User")
const Client = use("App/Models/Client")
const Deposit = use("App/Models/Deposit")
const Env = use('Env');
const { validateAll } = use('Validator');

const sk = Env.get('PAYSTACK_SECRET_KEY')
const Paystack = require('paystack-api')(sk);

class ClientController {
 async MakeDeposit({response,request,auth}){

    const { reference } = request.all()

    const validation = await validateAll( {reference},{reference:'required'});

    if (validation.fails()){
        return response.status(400).json({messages:validation.messages()})
    }
    
    const paymentVerification = await Paystack.transaction.verify({reference})

    var {status,amount,gatewayresponse} = paymentVerification.data

    amount = parseFloat(amount)/100

    const user = await auth.getUser();

    const {id:user_id} = user 

    const client_deposit = {user_id,amount,reference}

    if(status == "success"){
        // regiter Deposit in Deposit table
        const newDeposit = await Deposit.create({...client_deposit})
    
        const client_details = await user.client().fetch(); 

        var {balance:amount_from_db} = client_details

        amount_from_db += amount
            
        //update the client amount
        await Client
                .query()
                .where ('user_id',user_id)
                .update({balance:parseFloat(amount_from_db)})
        

            return response.status(200).json({newDeposit})
        }
        else {
            return response.status(200).json({message:gatewayresponse})
        }

 }

 async MakeDepositTest({request,response,auth}){

    return response.status(200).json({"message":auth.user})
 }
}



module.exports = ClientController
