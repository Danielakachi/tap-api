'use strict'

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Model = use('Model')

class Client extends Model {
    user(){
        return this.belongsTo('App/Models/User');
    }
    deposits(){
        return this.hasMany('App/Models/Deposit')
      }
      
     transfers(){
        return this.hasMany('App/Models/Transfer');
    }
    
}

module.exports = Client
