'use strict'
const User = use("App/Models/User")
const Merchant = use("App/Models/Merchant")
const AccountNumber = use("App/Models/AccountNumber")
const Transfer = use("App/Models/Transfer")
const Env = use('Env');
const { validateAll } = use('Validator');

const sk = Env.get('PAYSTACK_SECRET_KEY')
const Paystack = require('paystack-api')(sk);

class MerchantController {

    async addAccountNumber({request,response,auth}){
        const data = request.only(['account_number',"bank_code","bank"])

        const validation = await validateAll(data,{
            account_number:'required',
            bank_code:'required',
            bank:'required',
        })

        if(validation.fails()){
            return response.status(401).json({
                message:validation.messages()
            })
        }

        const {account_number,bank_code,bank} =data 
        const result = await Paystack.verification.resolveAccount({account_number,bank_code})

        if(result){
            const {account_name} = result.data
            
            const user = await auth.getUser()

            const {id:user_id,email} = user
            
            if(AccountNumber.query().where("user_id",user_id)){
                return response.status(401).json({message:"cannot have duplicate account details"})    
            }

            await AccountNumber.create({user_id,account_name,bank,bank_code,account_number})
            return response.status(401).json({result})
        }
        else return response.status(401).json({message:"error from paystack"})
        

        
    
    //add accountnumber

    //update account number
 
      }

      async getHistory({response,auth}){
        const user = await auth.getUser()

        const transfers = await Transfer.query().where("reciever_id",user.id).fetch()
    
        return response.status(200).json({
            user
       })
      }
    
}

module.exports = MerchantController;
