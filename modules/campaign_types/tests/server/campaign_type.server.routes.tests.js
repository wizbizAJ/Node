'use strict';

var should = require('should'),
  request = require('supertest'),
  path = require('path'),
  mongoose = require('mongoose'),
  User = mongoose.model('User'),
  Campaign_type = mongoose.model('Campaign_type'),
  express = require(path.resolve('./config/lib/express'));

/**
 * Globals
 */
var app,
  agent,
  credentials,
  user,
  campaign_type;

/**
 * Campaign_type routes tests
 */
describe('Campaign_type CRUD tests', function () {

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

    // Save a user to the test db and create new campaign_type
    user.save(function () {
      campaign_type = {
        title: 'Campaign_type Title',
        content: 'Campaign_type Content'
      };

      done();
    });
  });

  it('should not be able to save an campaign_type if logged in without the "admin" role', function (done) {
    agent.post('/api/auth/signin')
      .send(credentials)
      .expect(200)
      .end(function (signinErr, signinRes) {
        // Handle signin error
        if (signinErr) {
          return done(signinErr);
        }

        agent.post('/api/campaign_types')
          .send(campaign_type)
          .expect(403)
          .end(function (campaign_typeSaveErr, campaign_typeSaveRes) {
            // Call the assertion callback
            done(campaign_typeSaveErr);
          });

      });
  });

  it('should not be able to save an campaign_type if not logged in', function (done) {
    agent.post('/api/campaign_types')
      .send(campaign_type)
      .expect(403)
      .end(function (campaign_typeSaveErr, campaign_typeSaveRes) {
        // Call the assertion callback
        done(campaign_typeSaveErr);
      });
  });

  it('should not be able to update an campaign_type if signed in without the "admin" role', function (done) {
    agent.post('/api/auth/signin')
      .send(credentials)
      .expect(200)
      .end(function (signinErr, signinRes) {
        // Handle signin error
        if (signinErr) {
          return done(signinErr);
        }

        agent.post('/api/campaign_types')
          .send(campaign_type)
          .expect(403)
          .end(function (campaign_typeSaveErr, campaign_typeSaveRes) {
            // Call the assertion callback
            done(campaign_typeSaveErr);
          });
      });
  });

  it('should be able to get a list of campaign_types if not signed in', function (done) {
    // Create new campaign_type model instance
    var campaign_typeObj = new Campaign_type(campaign_type);

    // Save the campaign_type
    campaign_typeObj.save(function () {
      // Request campaign_types
      request(app).get('/api/campaign_types')
        .end(function (req, res) {
          // Set assertion
          res.body.should.be.instanceof(Array).and.have.lengthOf(1);

          // Call the assertion callback
          done();
        });

    });
  });

  it('should be able to get a single campaign_type if not signed in', function (done) {
    // Create new campaign_type model instance
    var campaign_typeObj = new Campaign_type(campaign_type);

    // Save the campaign_type
    campaign_typeObj.save(function () {
      request(app).get('/api/campaign_types/' + campaign_typeObj._id)
        .end(function (req, res) {
          // Set assertion
          res.body.should.be.instanceof(Object).and.have.property('title', campaign_type.title);

          // Call the assertion callback
          done();
        });
    });
  });

  it('should return proper error for single campaign_type with an invalid Id, if not signed in', function (done) {
    // test is not a valid mongoose Id
    request(app).get('/api/campaign_types/test')
      .end(function (req, res) {
        // Set assertion
        res.body.should.be.instanceof(Object).and.have.property('message', 'Campaign_type is invalid');

        // Call the assertion callback
        done();
      });
  });

  it('should return proper error for single campaign_type which doesnt exist, if not signed in', function (done) {
    // This is a valid mongoose Id but a non-existent campaign_type
    request(app).get('/api/campaign_types/559e9cd815f80b4c256a8f41')
      .end(function (req, res) {
        // Set assertion
        res.body.should.be.instanceof(Object).and.have.property('message', 'No campaign_type with that identifier has been found');

        // Call the assertion callback
        done();
      });
  });

  it('should not be able to delete an campaign_type if signed in without the "admin" role', function (done) {
    agent.post('/api/auth/signin')
      .send(credentials)
      .expect(200)
      .end(function (signinErr, signinRes) {
        // Handle signin error
        if (signinErr) {
          return done(signinErr);
        }

        agent.post('/api/campaign_types')
          .send(campaign_type)
          .expect(403)
          .end(function (campaign_typeSaveErr, campaign_typeSaveRes) {
            // Call the assertion callback
            done(campaign_typeSaveErr);
          });
      });
  });

  it('should not be able to delete an campaign_type if not signed in', function (done) {
    // Set campaign_type user
    campaign_type.user = user;

    // Create new campaign_type model instance
    var campaign_typeObj = new Campaign_type(campaign_type);

    // Save the campaign_type
    campaign_typeObj.save(function () {
      // Try deleting campaign_type
      request(app).delete('/api/campaign_types/' + campaign_typeObj._id)
        .expect(403)
        .end(function (campaign_typeDeleteErr, campaign_typeDeleteRes) {
          // Set message assertion
          (campaign_typeDeleteRes.body.message).should.match('User is not authorized');

          // Handle campaign_type error error
          done(campaign_typeDeleteErr);
        });

    });
  });

  it('should be able to get a single campaign_type that has an orphaned user reference', function (done) {
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

          // Save a new campaign_type
          agent.post('/api/campaign_types')
            .send(campaign_type)
            .expect(200)
            .end(function (campaign_typeSaveErr, campaign_typeSaveRes) {
              // Handle campaign_type save error
              if (campaign_typeSaveErr) {
                return done(campaign_typeSaveErr);
              }

              // Set assertions on new campaign_type
              (campaign_typeSaveRes.body.title).should.equal(campaign_type.title);
              should.exist(campaign_typeSaveRes.body.user);
              should.equal(campaign_typeSaveRes.body.user._id, orphanId);

              // force the campaign_type to have an orphaned user reference
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

                    // Get the campaign_type
                    agent.get('/api/campaign_types/' + campaign_typeSaveRes.body._id)
                      .expect(200)
                      .end(function (campaign_typeInfoErr, campaign_typeInfoRes) {
                        // Handle campaign_type error
                        if (campaign_typeInfoErr) {
                          return done(campaign_typeInfoErr);
                        }

                        // Set assertions
                        (campaign_typeInfoRes.body._id).should.equal(campaign_typeSaveRes.body._id);
                        (campaign_typeInfoRes.body.title).should.equal(campaign_type.title);
                        should.equal(campaign_typeInfoRes.body.user, undefined);

                        // Call the assertion callback
                        done();
                      });
                  });
              });
            });
        });
    });
  });

  it('should be able to get a single campaign_type if not signed in and verify the custom "isCurrentUserOwner" field is set to "false"', function (done) {
    // Create new campaign_type model instance
    var campaign_typeObj = new Campaign_type(campaign_type);

    // Save the campaign_type
    campaign_typeObj.save(function () {
      request(app).get('/api/campaign_types/' + campaign_typeObj._id)
        .end(function (req, res) {
          // Set assertion
          res.body.should.be.instanceof(Object).and.have.property('title', campaign_type.title);
          // Assert the custom field "isCurrentUserOwner" is set to false for the un-authenticated User
          res.body.should.be.instanceof(Object).and.have.property('isCurrentUserOwner', false);
          // Call the assertion callback
          done();
        });
    });
  });

  it('should be able to get single campaign_type, that a different user created, if logged in & verify the "isCurrentUserOwner" field is set to "false"', function (done) {
    // Create temporary user creds
    var _creds = {
      usernameOrEmail: 'campaign_typeowner',
      password: 'M3@n.jsI$Aw3$0m3'
    };

    // Create user that will create the Campaign_type
    var _campaign_typeOwner = new User({
      firstName: 'Full',
      lastName: 'Name',
      displayName: 'Full Name',
      email: 'temp@test.com',
      username: _creds.usernameOrEmail,
      password: _creds.password,
      provider: 'local',
      roles: ['admin', 'user']
    });

    _campaign_typeOwner.save(function (err, _user) {
      // Handle save error
      if (err) {
        return done(err);
      }

      // Sign in with the user that will create the Campaign_type
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

          // Save a new campaign_type
          agent.post('/api/campaign_types')
            .send(campaign_type)
            .expect(200)
            .end(function (campaign_typeSaveErr, campaign_typeSaveRes) {
              // Handle campaign_type save error
              if (campaign_typeSaveErr) {
                return done(campaign_typeSaveErr);
              }

              // Set assertions on new campaign_type
              (campaign_typeSaveRes.body.title).should.equal(campaign_type.title);
              should.exist(campaign_typeSaveRes.body.user);
              should.equal(campaign_typeSaveRes.body.user._id, userId);

              // now signin with the test suite user
              agent.post('/api/auth/signin')
                .send(credentials)
                .expect(200)
                .end(function (err, res) {
                  // Handle signin error
                  if (err) {
                    return done(err);
                  }

                  // Get the campaign_type
                  agent.get('/api/campaign_types/' + campaign_typeSaveRes.body._id)
                    .expect(200)
                    .end(function (campaign_typeInfoErr, campaign_typeInfoRes) {
                      // Handle campaign_type error
                      if (campaign_typeInfoErr) {
                        return done(campaign_typeInfoErr);
                      }

                      // Set assertions
                      (campaign_typeInfoRes.body._id).should.equal(campaign_typeSaveRes.body._id);
                      (campaign_typeInfoRes.body.title).should.equal(campaign_type.title);
                      // Assert that the custom field "isCurrentUserOwner" is set to false since the current User didn't create it
                      (campaign_typeInfoRes.body.isCurrentUserOwner).should.equal(false);

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
      Campaign_type.remove().exec(done);
    });
  });
});
