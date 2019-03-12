'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class TransferSchema extends Schema {
  up () {
    this.create('transfers', (table) => {
      table.increments()
      table.timestamps()
      table.integer('sender_id')
      .unsigned()
      .references('id')
      .inTable('users');
      table.integer('reciever_id')
      .unsigned()
      .references('id')
      .inTable('users');
      table.float('amount');
    })
  }

  down () {
    this.drop('transfers')
  }
}

module.exports = TransferSchema
