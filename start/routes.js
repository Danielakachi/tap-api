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
Route.post('register', 'AuthController.Register')
Route.post('register/client', 'AuthController.RegisterClient')
Route.post('register/merchant', 'AuthController.RegisterMerchant')


//Login
Route.post('login', 'AuthController.Login')

//user
Route.group('Client', ()=>{
  Route.post('deposit', 'ClientController.MakeDeposit')
  Route.post('deposit-test', 'ClientController.MakeDepositTest')  
}).middleware('auth') 

























// Route.get('/signup','ClientSignupController.index')

// Route.get('*', ()=>{
//   return { invalid: 'Sorry the request is invalid'}
// })