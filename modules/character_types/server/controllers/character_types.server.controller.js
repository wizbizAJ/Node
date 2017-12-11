'use strict';

/**
 * Module dependencies
 */
var path = require('path'),
  mongoose = require('mongoose'),
  geoip = require('geoip-lite'),
  Character_type = mongoose.model('Character_type'),
  errorHandler = require(path.resolve('./modules/core/server/controllers/errors.server.controller'));

/**
 * Create an character_type
 */
exports.create = function (req, res) {
  var character_type = new Character_type(req.body);
  character_type.user = req.user;
  character_type.updated = Date.now();

  var ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress || req.socket.remoteAddress || req.connection.socket.remoteAddress;
  var geo_location = geoip.lookup(ip);
  if (geo_location) {
    character_type.lastActivity = { 'ip': ip, 'country': geo_location.country, 'city': geo_location.city, 'latlong': geo_location.ll };
  } else {
    character_type.lastActivity = { 'ip': ip };
  }

  character_type.save(function (err) {
    if (err) {
      return res.status(422).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.json(character_type);
    }
  });
};

/**
 * Show the current character_type
 */
exports.read = function (req, res) {
  // convert mongoose document to JSON
  var character_type = req.character_type ? req.character_type.toJSON() : {};

  // Add a custom field to the Character_type, for determining if the current User is the "owner".
  // NOTE: This field is NOT persisted to the database, since it doesn't exist in the Character_type model.
  character_type.isCurrentUserOwner = !!(req.user && character_type.user && character_type.user._id.toString() === req.user._id.toString());

  res.json(character_type);
};

/**
 * Update an character_type
 */
exports.update = function (req, res) {
  var character_type = req.character_type;

  character_type.name = req.body.name;
  if (character_type.name !== 'Chef' && character_type.name !== 'Stylelist') {
    character_type.status = req.body.status;
  }
  character_type.code = req.body.code;
  character_type.default = req.body.default;
  character_type.description = req.body.description;
  character_type.updated = Date.now();

  var ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress || req.socket.remoteAddress || req.connection.socket.remoteAddress;
  var geo_location = geoip.lookup(ip);
  if (geo_location) {
    character_type.lastActivity = { 'ip': ip, 'country': geo_location.country, 'city': geo_location.city, 'latlong': geo_location.ll };
  } else {
    character_type.lastActivity = { 'ip': ip };
  }

  character_type.save(function (err) {
    if (err) {
      return res.status(422).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.json(character_type);
    }
  });
};

/**
 * Delete an character_type
 */
exports.delete = function (req, res) {
  var character_type = req.character_type;
  if (character_type.name !== 'Chef' && character_type.name !== 'Stylelist') {
    character_type.status = 'Deleted';
  }

  character_type.save(function (err) {
    if (err) {
      return res.status(422).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.json(character_type);
    }
  });
};

/**
 * List of Character_types
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
  Character_type.find(req.query).sort('-created').populate('user', 'displayName').exec(function (err, character_types) {
    if (err) {
      return res.status(422).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.json(character_types);
    }
  });
};

/**
 * Character_type middleware
 */
exports.character_typeByID = function (req, res, next, id) {

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).send({
      message: 'Character type is invalid'
    });
  }

  Character_type.findById(id).populate('user', 'displayName').exec(function (err, character_type) {
    if (err) {
      return next(err);
    } else if (!character_type) {
      return res.status(404).send({
        message: 'No character type with that identifier has been found'
      });
    }
    req.character_type = character_type;
    next();
  });
};
