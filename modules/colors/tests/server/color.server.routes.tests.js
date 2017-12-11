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
describe('Color CRUD tests', function () {

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

    // Save a user to the test db and create new color
    user.save(function () {
      color = {
        title: 'Color Title',
        content: 'Color Content'
      };

      done();
    });
  });

  it('should not be able to save an color if logged in without the "admin" role', function (done) {
    agent.post('/api/auth/signin')
      .send(credentials)
      .expect(200)
      .end(function (signinErr, signinRes) {
        // Handle signin error
        if (signinErr) {
          return done(signinErr);
        }

        agent.post('/api/colors')
          .send(color)
          .expect(403)
          .end(function (colorSaveErr, colorSaveRes) {
            // Call the assertion callback
            done(colorSaveErr);
          });

      });
  });

  it('should not be able to save an color if not logged in', function (done) {
    agent.post('/api/colors')
      .send(color)
      .expect(403)
      .end(function (colorSaveErr, colorSaveRes) {
        // Call the assertion callback
        done(colorSaveErr);
      });
  });

  it('should not be able to update an color if signed in without the "admin" role', function (done) {
    agent.post('/api/auth/signin')
      .send(credentials)
      .expect(200)
      .end(function (signinErr, signinRes) {
        // Handle signin error
        if (signinErr) {
          return done(signinErr);
        }

        agent.post('/api/colors')
          .send(color)
          .expect(403)
          .end(function (colorSaveErr, colorSaveRes) {
            // Call the assertion callback
            done(colorSaveErr);
          });
      });
  });

  it('should be able to get a list of colors if not signed in', function (done) {
    // Create new color model instance
    var colorObj = new Color(color);

    // Save the color
    colorObj.save(function () {
      // Request colors
      request(app).get('/api/colors')
        .end(function (req, res) {
          // Set assertion
          res.body.should.be.instanceof(Array).and.have.lengthOf(1);

          // Call the assertion callback
          done();
        });

    });
  });

  it('should be able to get a single color if not signed in', function (done) {
    // Create new color model instance
    var colorObj = new Color(color);

    // Save the color
    colorObj.save(function () {
      request(app).get('/api/colors/' + colorObj._id)
        .end(function (req, res) {
          // Set assertion
          res.body.should.be.instanceof(Object).and.have.property('title', color.title);

          // Call the assertion callback
          done();
        });
    });
  });

  it('should return proper error for single color with an invalid Id, if not signed in', function (done) {
    // test is not a valid mongoose Id
    request(app).get('/api/colors/test')
      .end(function (req, res) {
        // Set assertion
        res.body.should.be.instanceof(Object).and.have.property('message', 'Color is invalid');

        // Call the assertion callback
        done();
      });
  });

  it('should return proper error for single color which doesnt exist, if not signed in', function (done) {
    // This is a valid mongoose Id but a non-existent color
    request(app).get('/api/colors/559e9cd815f80b4c256a8f41')
      .end(function (req, res) {
        // Set assertion
        res.body.should.be.instanceof(Object).and.have.property('message', 'No color with that identifier has been found');

        // Call the assertion callback
        done();
      });
  });

  it('should not be able to delete an color if signed in without the "admin" role', function (done) {
    agent.post('/api/auth/signin')
      .send(credentials)
      .expect(200)
      .end(function (signinErr, signinRes) {
        // Handle signin error
        if (signinErr) {
          return done(signinErr);
        }

        agent.post('/api/colors')
          .send(color)
          .expect(403)
          .end(function (colorSaveErr, colorSaveRes) {
            // Call the assertion callback
            done(colorSaveErr);
          });
      });
  });

  it('should not be able to delete an color if not signed in', function (done) {
    // Set color user
    color.user = user;

    // Create new color model instance
    var colorObj = new Color(color);

    // Save the color
    colorObj.save(function () {
      // Try deleting color
      request(app).delete('/api/colors/' + colorObj._id)
        .expect(403)
        .end(function (colorDeleteErr, colorDeleteRes) {
          // Set message assertion
          (colorDeleteRes.body.message).should.match('User is not authorized');

          // Handle color error error
          done(colorDeleteErr);
        });

    });
  });

  it('should be able to get a single color that has an orphaned user reference', function (done) {
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

          // Save a new color
          agent.post('/api/colors')
            .send(color)
            .expect(200)
            .end(function (colorSaveErr, colorSaveRes) {
              // Handle color save error
              if (colorSaveErr) {
                return done(colorSaveErr);
              }

              // Set assertions on new color
              (colorSaveRes.body.title).should.equal(color.title);
              should.exist(colorSaveRes.body.user);
              should.equal(colorSaveRes.body.user._id, orphanId);

              // force the color to have an orphaned user reference
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
                        should.equal(colorInfoRes.body.user, undefined);

                        // Call the assertion callback
                        done();
                      });
                  });
              });
            });
        });
    });
  });

  it('should be able to get a single color if not signed in and verify the custom "isCurrentUserOwner" field is set to "false"', function (done) {
    // Create new color model instance
    var colorObj = new Color(color);

    // Save the color
    colorObj.save(function () {
      request(app).get('/api/colors/' + colorObj._id)
        .end(function (req, res) {
          // Set assertion
          res.body.should.be.instanceof(Object).and.have.property('title', color.title);
          // Assert the custom field "isCurrentUserOwner" is set to false for the un-authenticated User
          res.body.should.be.instanceof(Object).and.have.property('isCurrentUserOwner', false);
          // Call the assertion callback
          done();
        });
    });
  });

  it('should be able to get single color, that a different user created, if logged in & verify the "isCurrentUserOwner" field is set to "false"', function (done) {
    // Create temporary user creds
    var _creds = {
      usernameOrEmail: 'colorowner',
      password: 'M3@n.jsI$Aw3$0m3'
    };

    // Create user that will create the Color
    var _colorOwner = new User({
      firstName: 'Full',
      lastName: 'Name',
      displayName: 'Full Name',
      email: 'temp@test.com',
      username: _creds.usernameOrEmail,
      password: _creds.password,
      provider: 'local',
      roles: ['admin', 'user']
    });

    _colorOwner.save(function (err, _user) {
      // Handle save error
      if (err) {
        return done(err);
      }

      // Sign in with the user that will create the Color
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

          // Save a new color
          agent.post('/api/colors')
            .send(color)
            .expect(200)
            .end(function (colorSaveErr, colorSaveRes) {
              // Handle color save error
              if (colorSaveErr) {
                return done(colorSaveErr);
              }

              // Set assertions on new color
              (colorSaveRes.body.title).should.equal(color.title);
              should.exist(colorSaveRes.body.user);
              should.equal(colorSaveRes.body.user._id, userId);

              // now signin with the test suite user
              agent.post('/api/auth/signin')
                .send(credentials)
                .expect(200)
                .end(function (err, res) {
                  // Handle signin error
                  if (err) {
                    return done(err);
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
                      // Assert that the custom field "isCurrentUserOwner" is set to false since the current User didn't create it
                      (colorInfoRes.body.isCurrentUserOwner).should.equal(false);

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
      Color.remove().exec(done);
    });
  });
});
