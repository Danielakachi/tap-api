'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class MonthlybudgetSchema extends Schema {
  up () {
    this.create('monthlybudgets', (table) => {
      table.increments()
      table.timestamps()
      table
      .integer('user_id')
      .unsigned()
      .references('id')
      .inTable('users');
      table.float('budget')
      table.string('start_date')
      table.string('end_date')
    })
  }

  down () {
    this.drop('monthlybudgets')
  }
}

module.exports = MonthlybudgetSchema
