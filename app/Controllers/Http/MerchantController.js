'use strict'
const User = use("App/Models/User")
const Client = use("App/Models/Merchant")
const Deposit = use("App/Models/Deposit")
const Env = use('Env');
const { validateAll } = use('Validator');

const sk = Env.get('PAYSTACK_SECRET_KEY')
const Paystack = require('paystack-api')(sk);

class MerchantController {

 
}



module.exports = MerchantController;
