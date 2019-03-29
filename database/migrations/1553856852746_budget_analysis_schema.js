'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class BudgetAnalysisSchema extends Schema {
  up () {
    this.create('budget_analyses', (table) => {
      table.increments()
      table.timestamps()
      table
      .integer('user_id')
      .unsigned()
      .references('id')
      .inTable('clients');
      table.float('budget')
      table.date('start_date')
      table.date('end_date')

    })
  }

  down () {
    this.drop('budget_analyses')
  }
}

module.exports = BudgetAnalysisSchema
