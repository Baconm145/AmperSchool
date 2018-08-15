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
    findLessons: function( group_id ) {  
      return knex.select().from('lessons').where('group_id', group_id)
    },
    findLessonByDate: function( date ) {  
      return knex.select().from('lessons').whereBetween('date', [date + ' 00:00:00', date + ' 23:59:59' ] ).first()
    },
    findMarks: function( student_id, lesson_id ) {  
      return knex.select().from('marks').where('student_id', student_id).andWhere('lesson_id', lesson_id)
    },
    findHash: function( id ) {
      return knex.select().from('passwords').where('id', id).first()
    }
  };