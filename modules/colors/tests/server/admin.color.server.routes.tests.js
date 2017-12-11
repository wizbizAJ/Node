'use strict';

var should = require('should'),
  request = require('supertest'),
  path = require('path'),
  mongoose = require('mongoose'),
  User = mongoose.model('User'),
  Color = mongoose.model('Color'),
  express = require(path.resolve('./config/lib/express'));

/**
 * Globals
 */
var app,
  agent,
  credentials,
  user,
  color;

/**
 * Color routes tests
 */
describe('Color Admin CRUD tests', function () {
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

    // Save a user to the test db and create new color
    user.save(function () {
      color = {
        title: 'Color Title',
        content: 'Color Content'
      };

      done();
    });
  });

  it('should be able to save an color if logged in', function (done) {
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

        // Save a new color
        agent.post('/api/colors')
          .send(color)
          .expect(200)
          .end(function (colorSaveErr, colorSaveRes) {
            // Handle color save error
            if (colorSaveErr) {
              return done(colorSaveErr);
            }

            // Get a list of colors
            agent.get('/api/colors')
              .end(function (colorsGetErr, colorsGetRes) {
                // Handle color save error
                if (colorsGetErr) {
                  return done(colorsGetErr);
                }

                // Get colors list
                var colors = colorsGetRes.body;

                // Set assertions
                (colors[0].user._id).should.equal(userId);
                (colors[0].title).should.match('Color Title');

                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should be able to update an color if signed in', function (done) {
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

        // Save a new color
        agent.post('/api/colors')
          .send(color)
          .expect(200)
          .end(function (colorSaveErr, colorSaveRes) {
            // Handle color save error
            if (colorSaveErr) {
              return done(colorSaveErr);
            }

            // Update color title
            color.title = 'WHY YOU GOTTA BE SO MEAN?';

            // Update an existing color
            agent.put('/api/colors/' + colorSaveRes.body._id)
              .send(color)
              .expect(200)
              .end(function (colorUpdateErr, colorUpdateRes) {
                // Handle color update error
                if (colorUpdateErr) {
                  return done(colorUpdateErr);
                }

                // Set assertions
                (colorUpdateRes.body._id).should.equal(colorSaveRes.body._id);
                (colorUpdateRes.body.title).should.match('WHY YOU GOTTA BE SO MEAN?');

                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should not be able to save an color if no title is provided', function (done) {
    // Invalidate title field
    color.title = '';

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

        // Save a new color
        agent.post('/api/colors')
          .send(color)
          .expect(422)
          .end(function (colorSaveErr, colorSaveRes) {
            // Set message assertion
            (colorSaveRes.body.message).should.match('Title cannot be blank');

            // Handle color save error
            done(colorSaveErr);
          });
      });
  });

  it('should be able to delete an color if signed in', function (done) {
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

        // Save a new color
        agent.post('/api/colors')
          .send(color)
          .expect(200)
          .end(function (colorSaveErr, colorSaveRes) {
            // Handle color save error
            if (colorSaveErr) {
              return done(colorSaveErr);
            }

            // Delete an existing color
            agent.delete('/api/colors/' + colorSaveRes.body._id)
              .send(color)
              .expect(200)
              .end(function (colorDeleteErr, colorDeleteRes) {
                // Handle color error error
                if (colorDeleteErr) {
                  return done(colorDeleteErr);
                }

                // Set assertions
                (colorDeleteRes.body._id).should.equal(colorSaveRes.body._id);

                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should be able to get a single color if signed in and verify the custom "isCurrentUserOwner" field is set to "true"', function (done) {
    // Create new color model instance
    color.user = user;
    var colorObj = new Color(color);

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

        // Save a new color
        agent.post('/api/colors')
          .send(color)
          .expect(200)
          .end(function (colorSaveErr, colorSaveRes) {
            // Handle color save error
            if (colorSaveErr) {
              return done(colorSaveErr);
            }

            // Get the color
            agent.get('/api/colors/' + colorSaveRes.body._id)
              .expect(200)
              .end(function (colorInfoErr, colorInfoRes) {
                // Handle color error
                if (colorInfoErr) {
                  return done(colorInfoErr);
                }

                // Set assertions
                (colorInfoRes.body._id).should.equal(colorSaveRes.body._id);
                (colorInfoRes.body.title).should.equal(color.title);

                // Assert that the "isCurrentUserOwner" field is set to true since the current User created it
                (colorInfoRes.body.isCurrentUserOwner).should.equal(true);

                // Call the assertion callback
                done();
              });
          });
      });
  });

  afterEach(function (done) {
    User.remove().exec(function () {
      Color.remove().exec(done);
    });
  });
});
