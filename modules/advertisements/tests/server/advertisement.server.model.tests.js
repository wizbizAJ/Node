'use strict';

/**
 * Module dependencies.
 */
var should = require('should'),
  mongoose = require('mongoose'),
  User = mongoose.model('User'),
  Advertisement = mongoose.model('Advertisement');

/**
 * Globals
 */
var user,
  advertisement;

/**
 * Unit tests
 */
describe('Advertisement Model Unit Tests:', function () {

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
      advertisement = new Advertisement({
        title: 'Advertisement Title',
        content: 'Advertisement Content',
        user: user
      });

      done();
    });
  });

  describe('Method Save', function () {
    it('should be able to save without problems', function (done) {
      this.timeout(10000);
      advertisement.save(function (err) {
        should.not.exist(err);
        return done();
      });
    });

    it('should be able to show an error when try to save without title', function (done) {
      advertisement.title = '';

      advertisement.save(function (err) {
        should.exist(err);
        return done();
      });
    });
  });

  afterEach(function (done) {
    Advertisement.remove().exec(function () {
      User.remove().exec(done);
    });
  });
});
