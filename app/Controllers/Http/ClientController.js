'use strict'
const User = use("App/Models/User")
const Client = use("App/Models/Client")
const Deposit = use("App/Models/Deposit")
const Transfer = use("App/Models/Transfer")
const MonthlyBudget = use("App/Models/Monthlybudget")
const BudgetAnalysis = use("App/Models/BudgetAnalysis")
const Env = use('Env');
const { validateAll } = use('Validator');


const sk = Env.get('PAYSTACK_SECRET_KEY')
const Paystack = require('paystack-api')(sk);
const dayjs = require('dayjs')

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

    const deposits = await  user.deposits().orderBy('created_at','desc').fetch()
    const transfers = await Transfer.query().where("sender_id",user.id).orderBy('created_at','desc').fetch()
    

    return response.status(200).json({
        deposits,transfers
   })
  }

  async getDetails({response,auth}){
      const user = await auth.getUser()

      const {firstname,lastname, balance} = await user.client().fetch()
     
      return response.status(200).json({
        firstname,lastname,balance
   })

  }

  async setMonthlyBudget({request,response,auth}){
    const data = request.only(["amount"]);

    const validation = await  validateAll(data , {
        amount :'required'
    })
  
    if (validation.fails()){
      return response.status(400).json({
          message:validation.messages()
      })
   }
      const {amount:budget} = data
      const user = await auth.getUser()
      const {id:user_id} = user
      
      
    
    if ( await MonthlyBudget.findBy('user_id',user_id)){
        return response.status(200).json({
            message:'Cannot set more than one budget a month'
           })
    }

    // check if sufficient funds
     const {balance:client_balance} =  await user.client().fetch()

     if( parseFloat(budget) > parseFloat(client_balance)){
        return response.status(200).json({
            message:'Budget amount is more than available balance'
           })
     }
    
    const start_date_not_in_mill = new Date()
    const start_date = start_date_not_in_mill.getTime()

    // add 30 days to start_date
    var  end_date_not_in_mill = dayjs(start_date).add(30,'day')

    const end_date = end_date_not_in_mill.valueOf()

    end_date_not_in_mill = end_date_not_in_mill.toString()


    // persist in db
    const to_db ={budget,start_date,end_date,user_id}
    await MonthlyBudget.create({...to_db})

    // const detail = {budget,}
    // await BudgetAnalysis.create({})


    //   var  now_date = dayjs('2019-03-22 04:54:34');
    //    var  now_date = new Date(now_date).toDateString();

    //    var after_30 = dayjs(now_date).add(30,'day')
    // //    var after_30 = new Date(after_30).toDateString();

    // const now_date_mill = dayjs(now_date).valueOf()
    // const after_30_mill = dayjs(after_30).valueOf()

    // const new_now_date = new Date(now_date_mill).toDateString()

    // const millisecond = new Date('2019-03-28 11:34:15').getTime()

      

    return response.status(200).json({
    message: "Budget set successfully"
   })
 
  }

  async getBudgetAnalysis({response,auth}){
     

    // const {user_id:client_id} = await Client.findBy('user_id',id)
    // const {end_date,budget} = await BudgetAnalysis.findBy("user_id",client_id)

    // //check if current date < start_date  in redraw 

    // // get all amounts of date  {start_date<=amount<end_date}


    // //
    // const amounts = await Transfer.query().where("sender_id",client_id).select('amount').fetch()
    // let total_amount_spent = 0;
    // //check if array has one or more items
    // await amounts.toJSON().forEach(item => total_amount_spent += parseFloat(item.amount));

    // const remaining = budget-total_amount_spent

    // total_amount_spent,budget,remaining
      return response.status(200).json({
          what
      })
    }
    async getMonthlyBudgetAnalysis({response,auth}){
        const user = await auth.getUser()
        const {id} = user
        const {budget,start_date,end_date} = await user.monthlybudget().fetch()

        const today_date = new Date().getTime()
        //check if the budget has ended

        // add all amount within the start and end date
        const transfers = await Transfer.query().where("sender_id",id).fetch()
        let total_amount_spent = 0

        //sum up all the amount within the  start and end_date (timestamp)
         transfers.toJSON().forEach(item => {
            if( (parseInt(item.timestamp) >= parseInt(start_date) ) && (parseInt(item.timestamp) <= parseInt(end_date)) ){
                total_amount_spent += parseFloat(item.amount)
            }
        });

        const remaining = budget - total_amount_spent

        return response.status(200).json({
          total_amount_spent,budget,remaining
        })


  }

  
}



module.exports = ClientController;
