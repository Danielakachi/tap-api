'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class MerchantSchema extends Schema {
  up () {
    this.create('merchants', (table) => {
      table.increments()
      table.timestamps()
      table
        .integer('user_id')
        .unsigned()
        .references('id')
        .inTable('users');
      table.string('company_name',80).notNullable()
      table.float('balance')
    })
  }

  down () {
    this.drop('merchants')
  }
}

module.exports = MerchantSchema
