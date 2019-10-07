exports.seed = function(knex) {
  // Deletes ALL existing entries
  return knex('groceries').del()
  .then(() => knex('groceryList').del())
    .then(function () {
      // Inserts seed entries
      return Promise.all([
        knex('groceryList').insert({
          title: 'grcery list 1',
        },'id')
        .then(groceryList => {
          return knex('groceries').insert([
            { item: 'eggs', item_id: groceryList[0] },
            { item: 'bacon', item_id: groceryList[0] },
            { item: 'cheese', item_id: groceryList[0] },
            { item: 'milk', item_id: groceryList[0] },
            { item: 'bread', item_id: groceryList[0] }
          ])
        })
        .then(() => console.log('Seeding complete'))
        .catch(error => console.log(`Error seeding data: ${error}`))
      ])
    })
    .catch(error => console.log(`Error seeding data: ${error}`))
};
