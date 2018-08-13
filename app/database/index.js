const config = require('../../config')
var knex = require('knex')({
    client: 'pg',
    connection: config.knex.connection
  });

  module.exports = {
    findByName: function( username ) {  
      return knex.select().from('users').where('username', username).first()
    },
    findById: function( id ) {
      return knex.select().from('users').where('id', id).first()
    },
    findGroup: function( group_id ) {  
      return knex.select().from('groups').where('id', group_id).first()
    },
    findHash: function( id ) {
      return knex.select().from('passwords').where('id', id).first()
    }
  };