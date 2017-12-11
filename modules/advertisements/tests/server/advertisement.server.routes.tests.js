'use strict';

var should = require('should'),
  request = require('supertest'),
  path = require('path'),
  mongoose = require('mongoose'),
  User = mongoose.model('User'),
  Advertisement = mongoose.model('Advertisement'),
  express = require(path.resolve('./config/lib/express'));

/**
 * Globals
 */
var app,
  agent,
  credentials,
  user,
  advertisement;

/**
 * Advertisement routes tests
 */
describe('Advertisement CRUD tests', function () {

  before(function (done) {
    // Get application
    app = express.init(mongoose);
    agent = request.agent(app);

    done();
  });

  beforeEach(function (done) {
    // Create user credentials
    credentials = {
      usernameOrEmail: 'username',
      password: 'M3@n.jsI$Aw3$0m3'
    };

    // Create a new user
    user = new User({
      firstName: 'Full',
      lastName: 'Name',
      displayName: 'Full Name',
      email: 'test@test.com',
      username: credentials.usernameOrEmail,
      password: credentials.password,
      provider: 'local'
    });

    // Save a user to the test db and create new advertisement
    user.save(function () {
      advertisement = {
        title: 'Advertisement Title',
        content: 'Advertisement Content'
      };

      done();
    });
  });

  it('should not be able to save an advertisement if logged in without the "admin" role', function (done) {
    agent.post('/api/auth/signin')
      .send(credentials)
      .expect(200)
      .end(function (signinErr, signinRes) {
        // Handle signin error
        if (signinErr) {
          return done(signinErr);
        }

        agent.post('/api/advertisements')
          .send(advertisement)
          .expect(403)
          .end(function (advertisementSaveErr, advertisementSaveRes) {
            // Call the assertion callback
            done(advertisementSaveErr);
          });

      });
  });

  it('should not be able to save an advertisement if not logged in', function (done) {
    agent.post('/api/advertisements')
      .send(advertisement)
      .expect(403)
      .end(function (advertisementSaveErr, advertisementSaveRes) {
        // Call the assertion callback
        done(advertisementSaveErr);
      });
  });

  it('should not be able to update an advertisement if signed in without the "admin" role', function (done) {
    agent.post('/api/auth/signin')
      .send(credentials)
      .expect(200)
      .end(function (signinErr, signinRes) {
        // Handle signin error
        if (signinErr) {
          return done(signinErr);
        }

        agent.post('/api/advertisements')
          .send(advertisement)
          .expect(403)
          .end(function (advertisementSaveErr, advertisementSaveRes) {
            // Call the assertion callback
            done(advertisementSaveErr);
          });
      });
  });

  it('should be able to get a list of advertisements if not signed in', function (done) {
    // Create new advertisement model instance
    var advertisementObj = new Advertisement(advertisement);

    // Save the advertisement
    advertisementObj.save(function () {
      // Request advertisements
      request(app).get('/api/advertisements')
        .end(function (req, res) {
          // Set assertion
          res.body.should.be.instanceof(Array).and.have.lengthOf(1);

          // Call the assertion callback
          done();
        });

    });
  });

  it('should be able to get a single advertisement if not signed in', function (done) {
    // Create new advertisement model instance
    var advertisementObj = new Advertisement(advertisement);

    // Save the advertisement
    advertisementObj.save(function () {
      request(app).get('/api/advertisements/' + advertisementObj._id)
        .end(function (req, res) {
          // Set assertion
          res.body.should.be.instanceof(Object).and.have.property('title', advertisement.title);

          // Call the assertion callback
          done();
        });
    });
  });

  it('should return proper error for single advertisement with an invalid Id, if not signed in', function (done) {
    // test is not a valid mongoose Id
    request(app).get('/api/advertisements/test')
      .end(function (req, res) {
        // Set assertion
        res.body.should.be.instanceof(Object).and.have.property('message', 'Advertisement is invalid');

        // Call the assertion callback
        done();
      });
  });

  it('should return proper error for single advertisement which doesnt exist, if not signed in', function (done) {
    // This is a valid mongoose Id but a non-existent advertisement
    request(app).get('/api/advertisements/559e9cd815f80b4c256a8f41')
      .end(function (req, res) {
        // Set assertion
        res.body.should.be.instanceof(Object).and.have.property('message', 'No advertisement with that identifier has been found');

        // Call the assertion callback
        done();
      });
  });

  it('should not be able to delete an advertisement if signed in without the "admin" role', function (done) {
    agent.post('/api/auth/signin')
      .send(credentials)
      .expect(200)
      .end(function (signinErr, signinRes) {
        // Handle signin error
        if (signinErr) {
          return done(signinErr);
        }

        agent.post('/api/advertisements')
          .send(advertisement)
          .expect(403)
          .end(function (advertisementSaveErr, advertisementSaveRes) {
            // Call the assertion callback
            done(advertisementSaveErr);
          });
      });
  });

  it('should not be able to delete an advertisement if not signed in', function (done) {
    // Set advertisement user
    advertisement.user = user;

    // Create new advertisement model instance
    var advertisementObj = new Advertisement(advertisement);

    // Save the advertisement
    advertisementObj.save(function () {
      // Try deleting advertisement
      request(app).delete('/api/advertisements/' + advertisementObj._id)
        .expect(403)
        .end(function (advertisementDeleteErr, advertisementDeleteRes) {
          // Set message assertion
          (advertisementDeleteRes.body.message).should.match('User is not authorized');

          // Handle advertisement error error
          done(advertisementDeleteErr);
        });

    });
  });

  it('should be able to get a single advertisement that has an orphaned user reference', function (done) {
    // Create orphan user creds
    var _creds = {
      usernameOrEmail: 'orphan',
      password: 'M3@n.jsI$Aw3$0m3'
    };

    // Create orphan user
    var _orphan = new User({
      firstName: 'Full',
      lastName: 'Name',
      displayName: 'Full Name',
      email: 'orphan@test.com',
      username: _creds.usernameOrEmail,
      password: _creds.password,
      provider: 'local',
      roles: ['admin']
    });

    _orphan.save(function (err, orphan) {
      // Handle save error
      if (err) {
        return done(err);
      }

      agent.post('/api/auth/signin')
        .send(_creds)
        .expect(200)
        .end(function (signinErr, signinRes) {
          // Handle signin error
          if (signinErr) {
            return done(signinErr);
          }

          // Get the userId
          var orphanId = orphan._id;

          // Save a new advertisement
          agent.post('/api/advertisements')
            .send(advertisement)
            .expect(200)
            .end(function (advertisementSaveErr, advertisementSaveRes) {
              // Handle advertisement save error
              if (advertisementSaveErr) {
                return done(advertisementSaveErr);
              }

              // Set assertions on new advertisement
              (advertisementSaveRes.body.title).should.equal(advertisement.title);
              should.exist(advertisementSaveRes.body.user);
              should.equal(advertisementSaveRes.body.user._id, orphanId);

              // force the advertisement to have an orphaned user reference
              orphan.remove(function () {
                // now signin with valid user
                agent.post('/api/auth/signin')
                  .send(credentials)
                  .expect(200)
                  .end(function (err, res) {
                    // Handle signin error
                    if (err) {
                      return done(err);
                    }

                    // Get the advertisement
                    agent.get('/api/advertisements/' + advertisementSaveRes.body._id)
                      .expect(200)
                      .end(function (advertisementInfoErr, advertisementInfoRes) {
                        // Handle advertisement error
                        if (advertisementInfoErr) {
                          return done(advertisementInfoErr);
                        }

                        // Set assertions
                        (advertisementInfoRes.body._id).should.equal(advertisementSaveRes.body._id);
                        (advertisementInfoRes.body.title).should.equal(advertisement.title);
                        should.equal(advertisementInfoRes.body.user, undefined);

                        // Call the assertion callback
                        done();
                      });
                  });
              });
            });
        });
    });
  });

  it('should be able to get a single advertisement if not signed in and verify the custom "isCurrentUserOwner" field is set to "false"', function (done) {
    // Create new advertisement model instance
    var advertisementObj = new Advertisement(advertisement);

    // Save the advertisement
    advertisementObj.save(function () {
      request(app).get('/api/advertisements/' + advertisementObj._id)
        .end(function (req, res) {
          // Set assertion
          res.body.should.be.instanceof(Object).and.have.property('title', advertisement.title);
          // Assert the custom field "isCurrentUserOwner" is set to false for the un-authenticated User
          res.body.should.be.instanceof(Object).and.have.property('isCurrentUserOwner', false);
          // Call the assertion callback
          done();
        });
    });
  });

  it('should be able to get single advertisement, that a different user created, if logged in & verify the "isCurrentUserOwner" field is set to "false"', function (done) {
    // Create temporary user creds
    var _creds = {
      usernameOrEmail: 'advertisementowner',
      password: 'M3@n.jsI$Aw3$0m3'
    };

    // Create user that will create the Advertisement
    var _advertisementOwner = new User({
      firstName: 'Full',
      lastName: 'Name',
      displayName: 'Full Name',
      email: 'temp@test.com',
      username: _creds.usernameOrEmail,
      password: _creds.password,
      provider: 'local',
      roles: ['admin', 'user']
    });

    _advertisementOwner.save(function (err, _user) {
      // Handle save error
      if (err) {
        return done(err);
      }

      // Sign in with the user that will create the Advertisement
      agent.post('/api/auth/signin')
        .send(_creds)
        .expect(200)
        .end(function (signinErr, signinRes) {
          // Handle signin error
          if (signinErr) {
            return done(signinErr);
          }

          // Get the userId
          var userId = _user._id;

          // Save a new advertisement
          agent.post('/api/advertisements')
            .send(advertisement)
            .expect(200)
            .end(function (advertisementSaveErr, advertisementSaveRes) {
              // Handle advertisement save error
              if (advertisementSaveErr) {
                return done(advertisementSaveErr);
              }

              // Set assertions on new advertisement
              (advertisementSaveRes.body.title).should.equal(advertisement.title);
              should.exist(advertisementSaveRes.body.user);
              should.equal(advertisementSaveRes.body.user._id, userId);

              // now signin with the test suite user
              agent.post('/api/auth/signin')
                .send(credentials)
                .expect(200)
                .end(function (err, res) {
                  // Handle signin error
                  if (err) {
                    return done(err);
                  }

                  // Get the advertisement
                  agent.get('/api/advertisements/' + advertisementSaveRes.body._id)
                    .expect(200)
                    .end(function (advertisementInfoErr, advertisementInfoRes) {
                      // Handle advertisement error
                      if (advertisementInfoErr) {
                        return done(advertisementInfoErr);
                      }

                      // Set assertions
                      (advertisementInfoRes.body._id).should.equal(advertisementSaveRes.body._id);
                      (advertisementInfoRes.body.title).should.equal(advertisement.title);
                      // Assert that the custom field "isCurrentUserOwner" is set to false since the current User didn't create it
                      (advertisementInfoRes.body.isCurrentUserOwner).should.equal(false);

                      // Call the assertion callback
                      done();
                    });
                });
            });
        });
    });
  });

  afterEach(function (done) {
    User.remove().exec(function () {
      Advertisement.remove().exec(done);
    });
  });
});
