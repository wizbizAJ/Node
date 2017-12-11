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
describe('Advertisement Admin CRUD tests', function () {
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

    // Save a user to the test db and create new advertisement
    user.save(function () {
      advertisement = {
        title: 'Advertisement Title',
        content: 'Advertisement Content'
      };

      done();
    });
  });

  it('should be able to save an advertisement if logged in', function (done) {
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

        // Save a new advertisement
        agent.post('/api/advertisements')
          .send(advertisement)
          .expect(200)
          .end(function (advertisementSaveErr, advertisementSaveRes) {
            // Handle advertisement save error
            if (advertisementSaveErr) {
              return done(advertisementSaveErr);
            }

            // Get a list of advertisements
            agent.get('/api/advertisements')
              .end(function (advertisementsGetErr, advertisementsGetRes) {
                // Handle advertisement save error
                if (advertisementsGetErr) {
                  return done(advertisementsGetErr);
                }

                // Get advertisements list
                var advertisements = advertisementsGetRes.body;

                // Set assertions
                (advertisements[0].user._id).should.equal(userId);
                (advertisements[0].title).should.match('Advertisement Title');

                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should be able to update an advertisement if signed in', function (done) {
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

        // Save a new advertisement
        agent.post('/api/advertisements')
          .send(advertisement)
          .expect(200)
          .end(function (advertisementSaveErr, advertisementSaveRes) {
            // Handle advertisement save error
            if (advertisementSaveErr) {
              return done(advertisementSaveErr);
            }

            // Update advertisement title
            advertisement.title = 'WHY YOU GOTTA BE SO MEAN?';

            // Update an existing advertisement
            agent.put('/api/advertisements/' + advertisementSaveRes.body._id)
              .send(advertisement)
              .expect(200)
              .end(function (advertisementUpdateErr, advertisementUpdateRes) {
                // Handle advertisement update error
                if (advertisementUpdateErr) {
                  return done(advertisementUpdateErr);
                }

                // Set assertions
                (advertisementUpdateRes.body._id).should.equal(advertisementSaveRes.body._id);
                (advertisementUpdateRes.body.title).should.match('WHY YOU GOTTA BE SO MEAN?');

                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should not be able to save an advertisement if no title is provided', function (done) {
    // Invalidate title field
    advertisement.title = '';

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

        // Save a new advertisement
        agent.post('/api/advertisements')
          .send(advertisement)
          .expect(422)
          .end(function (advertisementSaveErr, advertisementSaveRes) {
            // Set message assertion
            (advertisementSaveRes.body.message).should.match('Title cannot be blank');

            // Handle advertisement save error
            done(advertisementSaveErr);
          });
      });
  });

  it('should be able to delete an advertisement if signed in', function (done) {
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

        // Save a new advertisement
        agent.post('/api/advertisements')
          .send(advertisement)
          .expect(200)
          .end(function (advertisementSaveErr, advertisementSaveRes) {
            // Handle advertisement save error
            if (advertisementSaveErr) {
              return done(advertisementSaveErr);
            }

            // Delete an existing advertisement
            agent.delete('/api/advertisements/' + advertisementSaveRes.body._id)
              .send(advertisement)
              .expect(200)
              .end(function (advertisementDeleteErr, advertisementDeleteRes) {
                // Handle advertisement error error
                if (advertisementDeleteErr) {
                  return done(advertisementDeleteErr);
                }

                // Set assertions
                (advertisementDeleteRes.body._id).should.equal(advertisementSaveRes.body._id);

                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should be able to get a single advertisement if signed in and verify the custom "isCurrentUserOwner" field is set to "true"', function (done) {
    // Create new advertisement model instance
    advertisement.user = user;
    var advertisementObj = new Advertisement(advertisement);

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

        // Save a new advertisement
        agent.post('/api/advertisements')
          .send(advertisement)
          .expect(200)
          .end(function (advertisementSaveErr, advertisementSaveRes) {
            // Handle advertisement save error
            if (advertisementSaveErr) {
              return done(advertisementSaveErr);
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

                // Assert that the "isCurrentUserOwner" field is set to true since the current User created it
                (advertisementInfoRes.body.isCurrentUserOwner).should.equal(true);

                // Call the assertion callback
                done();
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
