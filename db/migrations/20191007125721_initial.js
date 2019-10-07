exports.up = function(knex) {
  return Promise.all([
    knex.schema.createTable('groceryList', function(table) {
      table.increments('id').primary();
      table.string('title');

      table.timestamps(true, true);
    }),

    knex.schema.createTable('groceries', function(table) {
      table.increments('id').primary();
      table.string('item');
      table.integer('item_id').unsigned()
      table.foreign('item_id')
        .references('groceryList.id');

      table.timestamps(true, true);
    })
  ])
};


exports.down = function(knex) {
  return Promise.all([
    knex.schema.dropTable('items'),
    knex.schema.dropTable('groceryList')
  ]);
};