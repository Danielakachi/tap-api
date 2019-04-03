'use strict'

/*
|--------------------------------------------------------------------------
| Routes
|--------------------------------------------------------------------------
|
| Http routes are entry points to your web application. You can create
| routes for different URLs and bind Controller actions to them.
|
| A complete guide on routing is available here.
| http://adonisjs.com/docs/4.0/routing
|
*/

/** @type {typeof import('@adonisjs/framework/src/Route/Manager')} */
const Route = use('Route')

Route.get('/', () => {
  return { greeting: 'Hello world in JSON' }
})



// Register
Route.post('register/client', 'AuthController.RegisterClient')
Route.post('register/merchant', 'AuthController.RegisterMerchant')

//Login
Route.post('login', 'AuthController.login') 

//client
Route.group(()=>{
  Route.post('transaction/deposit', 'TransactionController.makeDeposit')
  Route.post('change-pin', 'ClientController.changePin')  
  Route.post('set-pin', 'ClientController.setPin')  
  //add
  Route.post('budget/monthly', 'ClientController.setMonthlyBudget')  
  

  Route.get('client/transaction/history','ClientController.getHistory')
  Route.get('merchant/transaction/history','MerchantController.getHistory')
  Route.get('client/details','ClientController.getDetails')
  Route.get('budget-analysis','ClientController.getBudgetAnalysis')
  Route.get('budget/monthly','ClientController.getMonthlyBudgetAnalysis')
  
  
  //merchant
  Route.post('transaction/transfer', 'TransactionController.transferFunds')
  Route.post('transaction/withdraw', 'TransactionController.withdraw')  
  Route.post('merchant/accountnumber', 'MerchantController.addAccountNumber')  
}).middleware('auth') 



//merchant


// //merchant
// Route.group('Merchant', ()=>{
//   Route.post('deposit', 'TransactionController.MakeDeposit')
//   Route.post('deposit-test', 'TransactionController.MakeDepositTest')  
// }).middleware('auth') 
























// Route.get('/signup','ClientSignupController.index')

// Route.get('*', ()=>{
//   return { invalid: 'Sorry the request is invalid'}
// })