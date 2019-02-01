'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class ClientSchema extends Schema {
  up () {
    this.create('clients', (table) => {
      table.increments()
      table.timestamps()
      table
        .integer('user_id')
        .unsigned()
        .references('id')
        .inTable('users');
      table.string('firstname',80).notNullable()
      table.string('lastname',80).notNullable()
      table.float('balance')
        
    })
  }

  down () {
    this.drop('clients')
  }
}

module.exports = ClientSchema



