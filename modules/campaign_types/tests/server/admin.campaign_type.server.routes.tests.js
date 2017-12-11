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
describe('Campaign_type Admin CRUD tests', function () {
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

    // Save a user to the test db and create new campaign_type
    user.save(function () {
      campaign_type = {
        title: 'Campaign_type Title',
        content: 'Campaign_type Content'
      };

      done();
    });
  });

  it('should be able to save an campaign_type if logged in', function (done) {
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

        // Save a new campaign_type
        agent.post('/api/campaign_types')
          .send(campaign_type)
          .expect(200)
          .end(function (campaign_typeSaveErr, campaign_typeSaveRes) {
            // Handle campaign_type save error
            if (campaign_typeSaveErr) {
              return done(campaign_typeSaveErr);
            }

            // Get a list of campaign_types
            agent.get('/api/campaign_types')
              .end(function (campaign_typesGetErr, campaign_typesGetRes) {
                // Handle campaign_type save error
                if (campaign_typesGetErr) {
                  return done(campaign_typesGetErr);
                }

                // Get campaign_types list
                var campaign_types = campaign_typesGetRes.body;

                // Set assertions
                (campaign_types[0].user._id).should.equal(userId);
                (campaign_types[0].title).should.match('Campaign_type Title');

                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should be able to update an campaign_type if signed in', function (done) {
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

        // Save a new campaign_type
        agent.post('/api/campaign_types')
          .send(campaign_type)
          .expect(200)
          .end(function (campaign_typeSaveErr, campaign_typeSaveRes) {
            // Handle campaign_type save error
            if (campaign_typeSaveErr) {
              return done(campaign_typeSaveErr);
            }

            // Update campaign_type title
            campaign_type.title = 'WHY YOU GOTTA BE SO MEAN?';

            // Update an existing campaign_type
            agent.put('/api/campaign_types/' + campaign_typeSaveRes.body._id)
              .send(campaign_type)
              .expect(200)
              .end(function (campaign_typeUpdateErr, campaign_typeUpdateRes) {
                // Handle campaign_type update error
                if (campaign_typeUpdateErr) {
                  return done(campaign_typeUpdateErr);
                }

                // Set assertions
                (campaign_typeUpdateRes.body._id).should.equal(campaign_typeSaveRes.body._id);
                (campaign_typeUpdateRes.body.title).should.match('WHY YOU GOTTA BE SO MEAN?');

                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should not be able to save an campaign_type if no title is provided', function (done) {
    // Invalidate title field
    campaign_type.title = '';

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

        // Save a new campaign_type
        agent.post('/api/campaign_types')
          .send(campaign_type)
          .expect(422)
          .end(function (campaign_typeSaveErr, campaign_typeSaveRes) {
            // Set message assertion
            (campaign_typeSaveRes.body.message).should.match('Title cannot be blank');

            // Handle campaign_type save error
            done(campaign_typeSaveErr);
          });
      });
  });

  it('should be able to delete an campaign_type if signed in', function (done) {
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

        // Save a new campaign_type
        agent.post('/api/campaign_types')
          .send(campaign_type)
          .expect(200)
          .end(function (campaign_typeSaveErr, campaign_typeSaveRes) {
            // Handle campaign_type save error
            if (campaign_typeSaveErr) {
              return done(campaign_typeSaveErr);
            }

            // Delete an existing campaign_type
            agent.delete('/api/campaign_types/' + campaign_typeSaveRes.body._id)
              .send(campaign_type)
              .expect(200)
              .end(function (campaign_typeDeleteErr, campaign_typeDeleteRes) {
                // Handle campaign_type error error
                if (campaign_typeDeleteErr) {
                  return done(campaign_typeDeleteErr);
                }

                // Set assertions
                (campaign_typeDeleteRes.body._id).should.equal(campaign_typeSaveRes.body._id);

                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should be able to get a single campaign_type if signed in and verify the custom "isCurrentUserOwner" field is set to "true"', function (done) {
    // Create new campaign_type model instance
    campaign_type.user = user;
    var campaign_typeObj = new Campaign_type(campaign_type);

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

        // Save a new campaign_type
        agent.post('/api/campaign_types')
          .send(campaign_type)
          .expect(200)
          .end(function (campaign_typeSaveErr, campaign_typeSaveRes) {
            // Handle campaign_type save error
            if (campaign_typeSaveErr) {
              return done(campaign_typeSaveErr);
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

                // Assert that the "isCurrentUserOwner" field is set to true since the current User created it
                (campaign_typeInfoRes.body.isCurrentUserOwner).should.equal(true);

                // Call the assertion callback
                done();
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
