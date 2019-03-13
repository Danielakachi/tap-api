'use strict'
const User = use("App/Models/User")
const Client = use("App/Models/Client")
const Merchant = use("App/Models/Merchant")
const Deposit = use("App/Models/Deposit")
const Transfer = use("App/Models/Transfer")
const Env = use('Env');
const { validateAll } = use('Validator');

const sk = Env.get('PAYSTACK_SECRET_KEY')
const Paystack = require('paystack-api')(sk);

class TransactionController {

    // for client to fund account
    async MakeDeposit({response,request,auth}){

        const { reference } = request.all() 
    
        const validation = await validateAll( {reference},{reference:'required'});
    
        if (validation.fails()){
            return response.status(400).json({message:validation.messages()})
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
     
     // to transfer funds from client to merchant
     async TransferFunds({request,response,auth}){
        const data = request.only(['email','amount','pin'])    
        
        const validation = await validateAll(data, {
            email :'required|email',
            amount :'required',
            pin:'required',
        })

        if(validation.fails()){
            return response.status(400).json({
                messag:validation.messages()
            })
        }

        var {email,amount:amount_to_send_from_client,pin} = data

        //get id of the client from email
        const {id:user_id_client} = await User.findBy('email',email)
        
        // get the pin from client
        var {pin:pin_from_db,balance:client_balance_from_db} = await Client.findBy('user_id',user_id_client)

        //if pin is invalid
        if(pin != pin_from_db ){
            return response.status(401).json({message: "Invalid pin"})
        }

        //if balance is insufficient
        if( parseFloat(amount_to_send_from_client) > parseFloat(client_balance_from_db) ){
            return response.status(401).json({message: "Insufficient fund"})
        }

        // check for if client is sending to Client 
        
        // Debit Client
        const new_client_balance = parseFloat(client_balance_from_db) - parseFloat(amount_to_send_from_client)

        await Client.query().where('user_id',user_id_client).update({balance:parseFloat(new_client_balance)})
        
        
        // Credit Merchant
        const user = await auth.getUser() 

        const {balance:merchant_balance_from_db,user_id:user_id_merchant} = await user.merchant().fetch()

        const new_merchant_balance = parseFloat(merchant_balance_from_db) + parseFloat(amount_to_send_from_client)

        await Merchant.query().where('user_id',user_id_merchant).update({balance:parseFloat(new_merchant_balance)})

        //add record in Transfer Table
        var amount = amount_to_send_from_client
        var sender_id = user_id_merchant
        var reciever_id = user_id_client
        const transfer_details ={amount,sender_id,reciever_id}
        await Transfer.create({...transfer_details})



        return response.status(200).json({message:"transaction complete"})


     }

     //to withdraw funds
     async withdraw({request,response,auth}){
         const data = request.only(['amount'])

         const validation =await  validateAll(data, {
             amount:'required'
         })

         if(validation.fails()){
             return response.status(401).json({
                 message:validation.messages()
             })
         }

         const user =await auth.getUser()

         return response.status(200).json({user})
         
         const {account_no:account_number,account_name:name,bank_code }= await user.accountnumber()

         //acquire tranfer_recipient
         const transferRecipient = Paystack.transfer_recipient.create({account_number,name,bank_code,type:'nuban'})

         if(transferRecipient){

         }
         // 
     }
     async MakeDepositTest({request,response,auth}){

        return response.status(200).json({"message":auth.user})
     }
    
    

}

module.exports = TransactionController;0