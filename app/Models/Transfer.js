'use strict'

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Model = use('Model')

class Transfer extends Model {
    Merchant(){
        return this.belongsTo('App/Models/Merchant');
    }
}

module.exports = Transfer
