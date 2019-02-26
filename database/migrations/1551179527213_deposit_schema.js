'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class DepositSchema extends Schema {
  up () {
    this.create('deposits', (table) => {
      table.increments()
      table.timestamps()
      table.integer('user_id').unsigned().references('id').inTable('users')
      table.string('reference')
      table.float('amount')
    })
  }

  down () {
    this.drop('deposits')
  }
}

module.exports = DepositSchema
