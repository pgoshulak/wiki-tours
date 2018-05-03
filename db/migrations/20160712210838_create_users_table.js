exports.up = function(knex, Promise) {
  return knex.schema.createTable('users', function(table){
      table.increments('id').primary();
      table.string('first_name');
      table.string('last_name');
      table.string('email');
      table.timestamp('date_joined');
  }).then(data => {
    return knex.schema.createTable('maps', function(table){
      table.increments('id').primary();
      table.string('title');
      table.string('description');
      table.timestamp('date_created').defaultTo(knex.fn.now());
      table.timestamp('date_updated').defaultTo(knex.fn.now());
      table.string('thumbnail_url');
    })
  }).then(data => {
    return knex.schema.createTable('points', function(table){
      table.increments('id').primary();
      table.string('latitude');
      table.string('longitude');
      table.string('title');
      table.string('description');
      table.string('image_url');
      table.string('embed_url');
      table.timestamp('date_created').defaultTo(knex.fn.now());
      table.timestamp('date_updated').defaultTo(knex.fn.now());
      table.boolean('owner_approved');
   })
  }).then(data => {
    return knex.schema.createTable('favourites', function(table){
      table.increments('id').primary();
      table.integer('map_id');
      table.foreign('map_id').references('maps.id');
      table.integer('user_id');
      table.foreign('user_id').references('users.id');
    })
  }).then(data => {
    return knex.schema.createTable('categories', function(table){
      table.increments('id').primary();
      table.string('name');
      table.string('thumbnail_url');
    })
  }).then(data => {
    return knex.schema.createTable('comments', function(table){
      table.increments('id').primary();
      table.integer('map_id');
      table.foreign('map_id').references('maps.id');
      table.integer('user_id');
      table.foreign('user_id').references('users.id');
      table.string('text');
      table.timestamp('date_created');
    })
  }).then(data => {
    return knex.schema.table('maps', function(table){
      table.integer('owner_id');
      table.foreign('owner_id').references('users.id');
      table.integer('category_id');
      table.foreign('category_id').references('categories.id');
    })
  }).then(data => {
    return knex.schema.table('points', function(table){
      table.integer('map_id');
      table.foreign('map_id').references('maps.id');
      table.integer('contributor_id');
      table.foreign('contributor_id').references('users.id');
    })
  })
};

exports.down = function(knex, Promise) {
  return Promise.all([
    knex.schema.dropTable('comments'),
    knex.schema.dropTable('categories'),
    knex.schema.dropTable('favourites'),
    knex.schema.dropTable('points'),
    knex.schema.dropTable('maps'),
    knex.schema.dropTable('users')
  ])
};
