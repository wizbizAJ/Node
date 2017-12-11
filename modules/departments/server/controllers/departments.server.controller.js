'use strict';

/**
 * Module dependencies
 */
var path = require('path'),
  mongoose = require('mongoose'),
  geoip = require('geoip-lite'),
  Department = mongoose.model('Department'),
  errorHandler = require(path.resolve('./modules/core/server/controllers/errors.server.controller'));

/**
 * Create an department
 */
exports.create = function (req, res) {
  var department = new Department(req.body);
  department.user = req.user;
  department.updated = Date.now();

  var ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress || req.socket.remoteAddress || req.connection.socket.remoteAddress;
  var geo_location = geoip.lookup(ip);
  if (geo_location) {
    department.lastActivity = { 'ip': ip, 'country': geo_location.country, 'city': geo_location.city, 'latlong': geo_location.ll };
  } else {
    department.lastActivity = { 'ip': ip };
  }

  department.save(function (err) {
    if (err) {
      return res.status(422).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.json(department);
    }
  });
};

/**
 * Show the current department
 */
exports.read = function (req, res) {
  // convert mongoose document to JSON
  var department = req.department ? req.department.toJSON() : {};

  // Add a custom field to the Department, for determining if the current User is the "owner".
  // NOTE: This field is NOT persisted to the database, since it doesn't exist in the Department model.
  department.isCurrentUserOwner = !!(req.user && department.user && department.user._id.toString() === req.user._id.toString());

  res.json(department);
};

/**
 * Update an department
 */
exports.update = function (req, res) {
  var department = req.department;

  department.name = req.body.name;
  department.contactName = req.body.contactName;
  department.contactNumber = req.body.contactNumber;
  department.status = req.body.status;
  department.code = req.body.code;
  department.default = req.body.default;
  department.description = req.body.description;
  department.userId = req.body.userId;
  department.updated = Date.now();

  var ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress || req.socket.remoteAddress || req.connection.socket.remoteAddress;
  var geo_location = geoip.lookup(ip);
  if (geo_location) {
    department.lastActivity = { 'ip': ip, 'country': geo_location.country, 'city': geo_location.city, 'latlong': geo_location.ll };
  } else {
    department.lastActivity = { 'ip': ip };
  }

  department.save(function (err) {
    if (err) {
      return res.status(422).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.json(department);
    }
  });
};

/**
 * Delete an department
 */
exports.delete = function (req, res) {
  var department = req.department;
  department.status = 'Deleted';

  department.save(function (err) {
    if (err) {
      return res.status(422).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.json(department);
    }
  });
};

/**
 * List of Departments
 */
function isJsonString(str) {
  try {
    JSON.parse(str);
  } catch (e) {
    return false;
  }
  return true;
}
exports.list = function (req, res) {
  for (var key in req.query) {
    if (isJsonString(req.query[key])) {
      req.query[key] = JSON.parse(req.query[key]);
    }
  }
  Department.find(req.query).sort('-created').populate('user', 'displayName').exec(function (err, departments) {
    if (err) {
      return res.status(422).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.json(departments);
    }
  });
};

/**
 * Department middleware
 */
exports.departmentByID = function (req, res, next, id) {

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).send({
      message: 'Character type is invalid'
    });
  }

  Department.findById(id).populate('user', 'displayName').exec(function (err, department) {
    if (err) {
      return next(err);
    } else if (!department) {
      return res.status(404).send({
        message: 'No character type with that identifier has been found'
      });
    }
    req.department = department;
    next();
  });
};
