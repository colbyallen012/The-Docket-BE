exports.up = function(knex) {
  return Promise.all([
    knex.schema.createTable('groceryLists', function(table) {
      table.increments('id').primary();
      table.string('list_title');

      table.timestamps(true, true);
    }),

    knex.schema.createTable('grocery_items', function(table) {
      table.increments('id').primary();
      table.string('item');
      table.integer('item_id').unsigned()
      table.foreign('item_id')
        .references('groceryLists.id');

      table.timestamps(true, true);
    })
  ])
};


exports.down = function(knex) {
  return Promise.all([
    knex.schema.dropTable('grocery_items'),
    knex.schema.dropTable('groceryLists')
  ]);
};