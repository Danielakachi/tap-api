'use strict'

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Model = use('Model')

class Merchant extends Model {
    user(){
        return this.belongsTo('App/Models/User');
    }
    transfers(){
        return this.hasMany('App/Models/Transfer');
    }
}

module.exports = Merchant
