const config = require('../../config')
var knex = require('knex')({
    client: 'pg',
    connection: config.knex.connection
  });

  module.exports = {
    findByName: function( username ) {  
      return knex.select().from('users').where('username', username).first()
    },
    findUsersByGroupId: function( group_id ) {
      return knex.select().from('users').where('group_id', group_id)
    },
    findById: function( id ) {
      return knex.select().from('users').where('id', id).first()
    },
    findGroup: function( group_id ) {  
      return knex.select().from('groups').where('id', group_id).first()
    },
    findEveryGroup: function( ) {  
      return knex.select().from('groups')
    },
    findLessons: function( group_id ) {  
      return knex.select().from('lessons').where('group_id', group_id)
    },
    findHomework: function( group_id ) {
      return knex.select().from('homework').where( 'group_id', group_id ).first()
    },
    findPayments: function( user_id ) {
      return knex.select().from('payments').where( 'user_id', user_id )
    },
    findLessonByDate: function( date, group_id ) {  
      return knex.select().from('lessons').whereBetween('date', [date + ' 00:00:00', date + ' 23:59:59' ] ).where( 'group_id', group_id ).first()
    },
    findMarks: function( student_id, lesson_id ) {  
      return knex.select().from('marks').where('student_id', student_id).andWhere('lesson_id', lesson_id)
    },
    findStudents: function( group_id ) {
      return knex.select().from('users').where('group_id', group_id)
    },
    findHash: function( id ) {
      return knex.select().from('passwords').where('id', id).first()
    },
    insertLesson: function(  group_id, date ) {
      return knex.insert( {'date': date, 'group_id': group_id} ).into('lessons')
    },
    findLesson: function( lesson_id ) {
      return knex.select().from('lessons').where('id', lesson_id).first()
    },
    insertMark: function(  lesson_id, student_id, mark, info ) {
      return knex.insert( {'lesson_id': lesson_id, 'student_id': student_id, 'mark' : mark, 'info' : info} ).into('marks')
    },
    insertGroup: function( name, timetable, price ) {
      return knex.insert( { 'name': name, 'timetable': timetable, 'price': price } ).into('groups')
    },
    insertUser: function( firstname, lastname, email, city, rights, username, group_id) {
      return knex.insert( { 'firstname': firstname, 'lastname': lastname, 'email': email, 'city': city, 'rights': rights, 'username': username, 'group_id': group_id } ).into('users')
    },
    insertHash: function( user_id, password ) {
      return knex.insert( { 'id': user_id, 'password': password } ).into('passwords')
    },
    findGroupByName: function( name ) {
      return knex.select().from('groups').where( 'name', name )
    },
    changeMark: function( mark_id, mark ) {
      return knex('marks').where( 'id', mark_id ).update( 'mark', mark )
    },
    updateAbsents: function( lesson_id, absents ) {
      return knex('lessons').where( 'id', lesson_id ).update( 'absents', absents )
    },
    updateGroup: function( id, timetable, price){
      return knex('groups').where( 'id', id ).update( 'timetable', timetable ).update( 'price', price )
    },
    updateAbsentsReasonable: function( lesson_id, absents_reasonable ) {
      return knex('lessons').where( 'id', lesson_id ).update( 'absents_reasonable', absents_reasonable )
    },
    updateHomework: function( group_id, homework ) {
      return knex('homework').where( 'group_id', group_id ).update( 'task', homework )
    },
    deleteMark: function( mark_id ) {
      return knex('marks').where( 'id', mark_id ).del()
    },
    findLessonsByMonthAndGroup: function( month, group_id ) {
      var Qstring = 'select * from lessons where extract( month from date) = ' + month.toString() + ' and group_id = ' + group_id.toString()
      return knex.raw( Qstring )
    }
  };