'use strict'

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Model = use('Model')

class AccountNumber extends Model {
    merchant(){
        return this.belongsTo('App/Models/Merchant');
      }

}

module.exports = AccountNumber
