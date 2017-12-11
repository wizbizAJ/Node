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
describe('Character_type Admin CRUD tests', function () {
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
      roles: ['user', 'admin'],
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

  it('should be able to save an character_type if logged in', function (done) {
    agent.post('/api/auth/signin')
      .send(credentials)
      .expect(200)
      .end(function (signinErr, signinRes) {
        // Handle signin error
        if (signinErr) {
          return done(signinErr);
        }

        // Get the userId
        var userId = user.id;

        // Save a new character_type
        agent.post('/api/character_types')
          .send(character_type)
          .expect(200)
          .end(function (character_typeSaveErr, character_typeSaveRes) {
            // Handle character_type save error
            if (character_typeSaveErr) {
              return done(character_typeSaveErr);
            }

            // Get a list of character_types
            agent.get('/api/character_types')
              .end(function (character_typesGetErr, character_typesGetRes) {
                // Handle character_type save error
                if (character_typesGetErr) {
                  return done(character_typesGetErr);
                }

                // Get character_types list
                var character_types = character_typesGetRes.body;

                // Set assertions
                (character_types[0].user._id).should.equal(userId);
                (character_types[0].title).should.match('Character_type Title');

                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should be able to update an character_type if signed in', function (done) {
    agent.post('/api/auth/signin')
      .send(credentials)
      .expect(200)
      .end(function (signinErr, signinRes) {
        // Handle signin error
        if (signinErr) {
          return done(signinErr);
        }

        // Get the userId
        var userId = user.id;

        // Save a new character_type
        agent.post('/api/character_types')
          .send(character_type)
          .expect(200)
          .end(function (character_typeSaveErr, character_typeSaveRes) {
            // Handle character_type save error
            if (character_typeSaveErr) {
              return done(character_typeSaveErr);
            }

            // Update character_type title
            character_type.title = 'WHY YOU GOTTA BE SO MEAN?';

            // Update an existing character_type
            agent.put('/api/character_types/' + character_typeSaveRes.body._id)
              .send(character_type)
              .expect(200)
              .end(function (character_typeUpdateErr, character_typeUpdateRes) {
                // Handle character_type update error
                if (character_typeUpdateErr) {
                  return done(character_typeUpdateErr);
                }

                // Set assertions
                (character_typeUpdateRes.body._id).should.equal(character_typeSaveRes.body._id);
                (character_typeUpdateRes.body.title).should.match('WHY YOU GOTTA BE SO MEAN?');

                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should not be able to save an character_type if no title is provided', function (done) {
    // Invalidate title field
    character_type.title = '';

    agent.post('/api/auth/signin')
      .send(credentials)
      .expect(200)
      .end(function (signinErr, signinRes) {
        // Handle signin error
        if (signinErr) {
          return done(signinErr);
        }

        // Get the userId
        var userId = user.id;

        // Save a new character_type
        agent.post('/api/character_types')
          .send(character_type)
          .expect(422)
          .end(function (character_typeSaveErr, character_typeSaveRes) {
            // Set message assertion
            (character_typeSaveRes.body.message).should.match('Title cannot be blank');

            // Handle character_type save error
            done(character_typeSaveErr);
          });
      });
  });

  it('should be able to delete an character_type if signed in', function (done) {
    agent.post('/api/auth/signin')
      .send(credentials)
      .expect(200)
      .end(function (signinErr, signinRes) {
        // Handle signin error
        if (signinErr) {
          return done(signinErr);
        }

        // Get the userId
        var userId = user.id;

        // Save a new character_type
        agent.post('/api/character_types')
          .send(character_type)
          .expect(200)
          .end(function (character_typeSaveErr, character_typeSaveRes) {
            // Handle character_type save error
            if (character_typeSaveErr) {
              return done(character_typeSaveErr);
            }

            // Delete an existing character_type
            agent.delete('/api/character_types/' + character_typeSaveRes.body._id)
              .send(character_type)
              .expect(200)
              .end(function (character_typeDeleteErr, character_typeDeleteRes) {
                // Handle character_type error error
                if (character_typeDeleteErr) {
                  return done(character_typeDeleteErr);
                }

                // Set assertions
                (character_typeDeleteRes.body._id).should.equal(character_typeSaveRes.body._id);

                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should be able to get a single character_type if signed in and verify the custom "isCurrentUserOwner" field is set to "true"', function (done) {
    // Create new character_type model instance
    character_type.user = user;
    var character_typeObj = new Character_type(character_type);

    agent.post('/api/auth/signin')
      .send(credentials)
      .expect(200)
      .end(function (signinErr, signinRes) {
        // Handle signin error
        if (signinErr) {
          return done(signinErr);
        }

        // Get the userId
        var userId = user.id;

        // Save a new character_type
        agent.post('/api/character_types')
          .send(character_type)
          .expect(200)
          .end(function (character_typeSaveErr, character_typeSaveRes) {
            // Handle character_type save error
            if (character_typeSaveErr) {
              return done(character_typeSaveErr);
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

                // Assert that the "isCurrentUserOwner" field is set to true since the current User created it
                (character_typeInfoRes.body.isCurrentUserOwner).should.equal(true);

                // Call the assertion callback
                done();
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
