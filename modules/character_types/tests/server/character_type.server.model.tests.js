'use strict';

/**
 * Module dependencies.
 */
var should = require('should'),
  mongoose = require('mongoose'),
  User = mongoose.model('User'),
  Character_type = mongoose.model('Character_type');

/**
 * Globals
 */
var user,
  character_type;

/**
 * Unit tests
 */
describe('Character_type Model Unit Tests:', function () {

  beforeEach(function (done) {
    user = new User({
      firstName: 'Full',
      lastName: 'Name',
      displayName: 'Full Name',
      email: 'test@test.com',
      username: 'username',
      password: 'M3@n.jsI$Aw3$0m3'
    });

    user.save(function () {
      character_type = new Character_type({
        title: 'Character_type Title',
        content: 'Character_type Content',
        user: user
      });

      done();
    });
  });

  describe('Method Save', function () {
    it('should be able to save without problems', function (done) {
      this.timeout(10000);
      character_type.save(function (err) {
        should.not.exist(err);
        return done();
      });
    });

    it('should be able to show an error when try to save without title', function (done) {
      character_type.title = '';

      character_type.save(function (err) {
        should.exist(err);
        return done();
      });
    });
  });

  afterEach(function (done) {
    Character_type.remove().exec(function () {
      User.remove().exec(done);
    });
  });
});
