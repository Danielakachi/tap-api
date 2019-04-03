'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class TransferSchema extends Schema {
  up () {
    this.table('transfers', (table) => {
      // alter table
      table.string("timestamp",40) 
    })
  }

  down () {
    this.table('transfers', (table) => {
      // reverse alternations
      table.dropColumn("timestamp")
    })
  }
}

module.exports = TransferSchema
