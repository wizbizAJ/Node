'use strict';

var should = require('should'),
  request = require('supertest'),
  path = require('path'),
  mongoose = require('mongoose'),
  User = mongoose.model('User'),
  Character_type = mongoose.model('Character_type'),
  express = require(path.resolve('./config/lib/express'));

/**
 * Globals
 */
var app,
  agent,
  credentials,
  user,
  character_type;

/**
 * Character_type routes tests
 */
describe('Character_type CRUD tests', function () {

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

    // Save a user to the test db and create new character_type
    user.save(function () {
      character_type = {
        title: 'Character_type Title',
        content: 'Character_type Content'
      };

      done();
    });
  });

  it('should not be able to save an character_type if logged in without the "admin" role', function (done) {
    agent.post('/api/auth/signin')
      .send(credentials)
      .expect(200)
      .end(function (signinErr, signinRes) {
        // Handle signin error
        if (signinErr) {
          return done(signinErr);
        }

        agent.post('/api/character_types')
          .send(character_type)
          .expect(403)
          .end(function (character_typeSaveErr, character_typeSaveRes) {
            // Call the assertion callback
            done(character_typeSaveErr);
          });

      });
  });

  it('should not be able to save an character_type if not logged in', function (done) {
    agent.post('/api/character_types')
      .send(character_type)
      .expect(403)
      .end(function (character_typeSaveErr, character_typeSaveRes) {
        // Call the assertion callback
        done(character_typeSaveErr);
      });
  });

  it('should not be able to update an character_type if signed in without the "admin" role', function (done) {
    agent.post('/api/auth/signin')
      .send(credentials)
      .expect(200)
      .end(function (signinErr, signinRes) {
        // Handle signin error
        if (signinErr) {
          return done(signinErr);
        }

        agent.post('/api/character_types')
          .send(character_type)
          .expect(403)
          .end(function (character_typeSaveErr, character_typeSaveRes) {
            // Call the assertion callback
            done(character_typeSaveErr);
          });
      });
  });

  it('should be able to get a list of character_types if not signed in', function (done) {
    // Create new character_type model instance
    var character_typeObj = new Character_type(character_type);

    // Save the character_type
    character_typeObj.save(function () {
      // Request character_types
      request(app).get('/api/character_types')
        .end(function (req, res) {
          // Set assertion
          res.body.should.be.instanceof(Array).and.have.lengthOf(1);

          // Call the assertion callback
          done();
        });

    });
  });

  it('should be able to get a single character_type if not signed in', function (done) {
    // Create new character_type model instance
    var character_typeObj = new Character_type(character_type);

    // Save the character_type
    character_typeObj.save(function () {
      request(app).get('/api/character_types/' + character_typeObj._id)
        .end(function (req, res) {
          // Set assertion
          res.body.should.be.instanceof(Object).and.have.property('title', character_type.title);

          // Call the assertion callback
          done();
        });
    });
  });

  it('should return proper error for single character_type with an invalid Id, if not signed in', function (done) {
    // test is not a valid mongoose Id
    request(app).get('/api/character_types/test')
      .end(function (req, res) {
        // Set assertion
        res.body.should.be.instanceof(Object).and.have.property('message', 'Character_type is invalid');

        // Call the assertion callback
        done();
      });
  });

  it('should return proper error for single character_type which doesnt exist, if not signed in', function (done) {
    // This is a valid mongoose Id but a non-existent character_type
    request(app).get('/api/character_types/559e9cd815f80b4c256a8f41')
      .end(function (req, res) {
        // Set assertion
        res.body.should.be.instanceof(Object).and.have.property('message', 'No character_type with that identifier has been found');

        // Call the assertion callback
        done();
      });
  });

  it('should not be able to delete an character_type if signed in without the "admin" role', function (done) {
    agent.post('/api/auth/signin')
      .send(credentials)
      .expect(200)
      .end(function (signinErr, signinRes) {
        // Handle signin error
        if (signinErr) {
          return done(signinErr);
        }

        agent.post('/api/character_types')
          .send(character_type)
          .expect(403)
          .end(function (character_typeSaveErr, character_typeSaveRes) {
            // Call the assertion callback
            done(character_typeSaveErr);
          });
      });
  });

  it('should not be able to delete an character_type if not signed in', function (done) {
    // Set character_type user
    character_type.user = user;

    // Create new character_type model instance
    var character_typeObj = new Character_type(character_type);

    // Save the character_type
    character_typeObj.save(function () {
      // Try deleting character_type
      request(app).delete('/api/character_types/' + character_typeObj._id)
        .expect(403)
        .end(function (character_typeDeleteErr, character_typeDeleteRes) {
          // Set message assertion
          (character_typeDeleteRes.body.message).should.match('User is not authorized');

          // Handle character_type error error
          done(character_typeDeleteErr);
        });

    });
  });

  it('should be able to get a single character_type that has an orphaned user reference', function (done) {
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

          // Save a new character_type
          agent.post('/api/character_types')
            .send(character_type)
            .expect(200)
            .end(function (character_typeSaveErr, character_typeSaveRes) {
              // Handle character_type save error
              if (character_typeSaveErr) {
                return done(character_typeSaveErr);
              }

              // Set assertions on new character_type
              (character_typeSaveRes.body.title).should.equal(character_type.title);
              should.exist(character_typeSaveRes.body.user);
              should.equal(character_typeSaveRes.body.user._id, orphanId);

              // force the character_type to have an orphaned user reference
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

                    // Get the character_type
                    agent.get('/api/character_types/' + character_typeSaveRes.body._id)
                      .expect(200)
                      .end(function (character_typeInfoErr, character_typeInfoRes) {
                        // Handle character_type error
                        if (character_typeInfoErr) {
                          return done(character_typeInfoErr);
                        }

                        // Set assertions
                        (character_typeInfoRes.body._id).should.equal(character_typeSaveRes.body._id);
                        (character_typeInfoRes.body.title).should.equal(character_type.title);
                        should.equal(character_typeInfoRes.body.user, undefined);

                        // Call the assertion callback
                        done();
                      });
                  });
              });
            });
        });
    });
  });

  it('should be able to get a single character_type if not signed in and verify the custom "isCurrentUserOwner" field is set to "false"', function (done) {
    // Create new character_type model instance
    var character_typeObj = new Character_type(character_type);

    // Save the character_type
    character_typeObj.save(function () {
      request(app).get('/api/character_types/' + character_typeObj._id)
        .end(function (req, res) {
          // Set assertion
          res.body.should.be.instanceof(Object).and.have.property('title', character_type.title);
          // Assert the custom field "isCurrentUserOwner" is set to false for the un-authenticated User
          res.body.should.be.instanceof(Object).and.have.property('isCurrentUserOwner', false);
          // Call the assertion callback
          done();
        });
    });
  });

  it('should be able to get single character_type, that a different user created, if logged in & verify the "isCurrentUserOwner" field is set to "false"', function (done) {
    // Create temporary user creds
    var _creds = {
      usernameOrEmail: 'character_typeowner',
      password: 'M3@n.jsI$Aw3$0m3'
    };

    // Create user that will create the Character_type
    var _character_typeOwner = new User({
      firstName: 'Full',
      lastName: 'Name',
      displayName: 'Full Name',
      email: 'temp@test.com',
      username: _creds.usernameOrEmail,
      password: _creds.password,
      provider: 'local',
      roles: ['admin', 'user']
    });

    _character_typeOwner.save(function (err, _user) {
      // Handle save error
      if (err) {
        return done(err);
      }

      // Sign in with the user that will create the Character_type
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

          // Save a new character_type
          agent.post('/api/character_types')
            .send(character_type)
            .expect(200)
            .end(function (character_typeSaveErr, character_typeSaveRes) {
              // Handle character_type save error
              if (character_typeSaveErr) {
                return done(character_typeSaveErr);
              }

              // Set assertions on new character_type
              (character_typeSaveRes.body.title).should.equal(character_type.title);
              should.exist(character_typeSaveRes.body.user);
              should.equal(character_typeSaveRes.body.user._id, userId);

              // now signin with the test suite user
              agent.post('/api/auth/signin')
                .send(credentials)
                .expect(200)
                .end(function (err, res) {
                  // Handle signin error
                  if (err) {
                    return done(err);
                  }

                  // Get the character_type
                  agent.get('/api/character_types/' + character_typeSaveRes.body._id)
                    .expect(200)
                    .end(function (character_typeInfoErr, character_typeInfoRes) {
                      // Handle character_type error
                      if (character_typeInfoErr) {
                        return done(character_typeInfoErr);
                      }

                      // Set assertions
                      (character_typeInfoRes.body._id).should.equal(character_typeSaveRes.body._id);
                      (character_typeInfoRes.body.title).should.equal(character_type.title);
                      // Assert that the custom field "isCurrentUserOwner" is set to false since the current User didn't create it
                      (character_typeInfoRes.body.isCurrentUserOwner).should.equal(false);

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
      Character_type.remove().exec(done);
    });
  });
});
