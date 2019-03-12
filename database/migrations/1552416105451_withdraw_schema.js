'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class WithdrawSchema extends Schema {
  up () {
    this.create('withdraws', (table) => {
      table.increments()
      table.timestamps()
    })
  }

  down () {
    this.drop('withdraws')
  }
}

module.exports = WithdrawSchema
