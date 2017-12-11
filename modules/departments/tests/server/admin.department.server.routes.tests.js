'use strict';

var should = require('should'),
  request = require('supertest'),
  path = require('path'),
  mongoose = require('mongoose'),
  User = mongoose.model('User'),
  Department = mongoose.model('Department'),
  express = require(path.resolve('./config/lib/express'));

/**
 * Globals
 */
var app,
  agent,
  credentials,
  user,
  department;

/**
 * Department routes tests
 */
describe('Department Admin CRUD tests', function () {
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

    // Save a user to the test db and create new department
    user.save(function () {
      department = {
        title: 'Department Title',
        content: 'Department Content'
      };

      done();
    });
  });

  it('should be able to save an department if logged in', function (done) {
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

        // Save a new department
        agent.post('/api/departments')
          .send(department)
          .expect(200)
          .end(function (departmentSaveErr, departmentSaveRes) {
            // Handle department save error
            if (departmentSaveErr) {
              return done(departmentSaveErr);
            }

            // Get a list of departments
            agent.get('/api/departments')
              .end(function (departmentsGetErr, departmentsGetRes) {
                // Handle department save error
                if (departmentsGetErr) {
                  return done(departmentsGetErr);
                }

                // Get departments list
                var departments = departmentsGetRes.body;

                // Set assertions
                (departments[0].user._id).should.equal(userId);
                (departments[0].title).should.match('Department Title');

                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should be able to update an department if signed in', function (done) {
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

        // Save a new department
        agent.post('/api/departments')
          .send(department)
          .expect(200)
          .end(function (departmentSaveErr, departmentSaveRes) {
            // Handle department save error
            if (departmentSaveErr) {
              return done(departmentSaveErr);
            }

            // Update department title
            department.title = 'WHY YOU GOTTA BE SO MEAN?';

            // Update an existing department
            agent.put('/api/departments/' + departmentSaveRes.body._id)
              .send(department)
              .expect(200)
              .end(function (departmentUpdateErr, departmentUpdateRes) {
                // Handle department update error
                if (departmentUpdateErr) {
                  return done(departmentUpdateErr);
                }

                // Set assertions
                (departmentUpdateRes.body._id).should.equal(departmentSaveRes.body._id);
                (departmentUpdateRes.body.title).should.match('WHY YOU GOTTA BE SO MEAN?');

                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should not be able to save an department if no title is provided', function (done) {
    // Invalidate title field
    department.title = '';

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

        // Save a new department
        agent.post('/api/departments')
          .send(department)
          .expect(422)
          .end(function (departmentSaveErr, departmentSaveRes) {
            // Set message assertion
            (departmentSaveRes.body.message).should.match('Title cannot be blank');

            // Handle department save error
            done(departmentSaveErr);
          });
      });
  });

  it('should be able to delete an department if signed in', function (done) {
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

        // Save a new department
        agent.post('/api/departments')
          .send(department)
          .expect(200)
          .end(function (departmentSaveErr, departmentSaveRes) {
            // Handle department save error
            if (departmentSaveErr) {
              return done(departmentSaveErr);
            }

            // Delete an existing department
            agent.delete('/api/departments/' + departmentSaveRes.body._id)
              .send(department)
              .expect(200)
              .end(function (departmentDeleteErr, departmentDeleteRes) {
                // Handle department error error
                if (departmentDeleteErr) {
                  return done(departmentDeleteErr);
                }

                // Set assertions
                (departmentDeleteRes.body._id).should.equal(departmentSaveRes.body._id);

                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should be able to get a single department if signed in and verify the custom "isCurrentUserOwner" field is set to "true"', function (done) {
    // Create new department model instance
    department.user = user;
    var departmentObj = new Department(department);

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

        // Save a new department
        agent.post('/api/departments')
          .send(department)
          .expect(200)
          .end(function (departmentSaveErr, departmentSaveRes) {
            // Handle department save error
            if (departmentSaveErr) {
              return done(departmentSaveErr);
            }

            // Get the department
            agent.get('/api/departments/' + departmentSaveRes.body._id)
              .expect(200)
              .end(function (departmentInfoErr, departmentInfoRes) {
                // Handle department error
                if (departmentInfoErr) {
                  return done(departmentInfoErr);
                }

                // Set assertions
                (departmentInfoRes.body._id).should.equal(departmentSaveRes.body._id);
                (departmentInfoRes.body.title).should.equal(department.title);

                // Assert that the "isCurrentUserOwner" field is set to true since the current User created it
                (departmentInfoRes.body.isCurrentUserOwner).should.equal(true);

                // Call the assertion callback
                done();
              });
          });
      });
  });

  afterEach(function (done) {
    User.remove().exec(function () {
      Department.remove().exec(done);
    });
  });
});
