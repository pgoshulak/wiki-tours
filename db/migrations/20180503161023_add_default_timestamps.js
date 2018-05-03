
exports.up = function(knex, Promise) {
  return knex.schema.alterTable('users', function(table) {
    table.dropColumn('date_joined');
  }).then(data => {
    return knex.schema.alterTable('users', function(table) {
      table.timestamp('date_joined').defaultTo(knex.fn.now());
    })
  }).then(data => {
    return knex.schema.alterTable('comments', function(table) {
      table.dropColumn('date_created');
    })
  }).then(data => {
    return knex.schema.alterTable('comments', function(table) {
      table.timestamp('date_created').defaultTo(knex.fn.now());
    })
  })
};


exports.down = function(knex, Promise) {
  return knex.schema.alterTable('users', function(table) {
    table.dropColumn('date_joined');
  }).then(data => {
    return knex.schema.alterTable('users', function(table) {
      table.timestamp('date_joined');
    })
  }).then(data => {
    return knex.schema.alterTable('comments', function(table) {
      table.dropColumn('date_created');
    })
  }).then(data => {
    return knex.schema.alterTable('comments', function(table) {
      table.timestamp('date_created');
    })
  })
};
