'use strict';

/**
 * Module dependencies
 */
var path = require('path'),
  mongoose = require('mongoose'),
  geoip = require('geoip-lite'),
  Campaign_type = mongoose.model('Campaign_type'),
  errorHandler = require(path.resolve('./modules/core/server/controllers/errors.server.controller'));

/**
 * Create an campaign_type
 */
exports.create = function (req, res) {
  var campaign_type = new Campaign_type(req.body);
  campaign_type.user = req.user;
  campaign_type.updated = Date.now();

  var ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress || req.socket.remoteAddress || req.connection.socket.remoteAddress;
  var geo_location = geoip.lookup(ip);
  if (geo_location) {
    campaign_type.lastActivity = { 'ip': ip, 'country': geo_location.country, 'city': geo_location.city, 'latlong': geo_location.ll };
  } else {
    campaign_type.lastActivity = { 'ip': ip };
  }

  campaign_type.save(function (err) {
    if (err) {
      return res.status(422).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.json(campaign_type);
    }
  });
};

/**
 * Show the current campaign_type
 */
exports.read = function (req, res) {
  // convert mongoose document to JSON
  var campaign_type = req.campaign_type ? req.campaign_type.toJSON() : {};

  // Add a custom field to the Campaign_type, for determining if the current User is the "owner".
  // NOTE: This field is NOT persisted to the database, since it doesn't exist in the Campaign_type model.
  campaign_type.isCurrentUserOwner = !!(req.user && campaign_type.user && campaign_type.user._id.toString() === req.user._id.toString());

  res.json(campaign_type);
};

/**
 * Update an campaign_type
 */
exports.update = function (req, res) {
  var campaign_type = req.campaign_type;

  campaign_type.name = req.body.name;
  campaign_type.status = req.body.status;
  campaign_type.code = req.body.code;
  campaign_type.channel = req.body.channel;
  campaign_type.default = req.body.default;
  campaign_type.adminOnly = req.body.adminOnly;
  campaign_type.duringBroadcast = req.body.duringBroadcast;
  campaign_type.broadcastEvent = req.body.broadcastEvent;
  campaign_type.linkProducts = req.body.linkProducts;
  campaign_type.description = req.body.description;
  campaign_type.duringCta = req.body.duringCta;
  campaign_type.afterCta = req.body.afterCta;
  campaign_type.productLineOption = req.body.productLineOption;

  campaign_type.updated = Date.now();

  var ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress || req.socket.remoteAddress || req.connection.socket.remoteAddress;
  var geo_location = geoip.lookup(ip);
  if (geo_location) {
    campaign_type.lastActivity = { 'ip': ip, 'country': geo_location.country, 'city': geo_location.city, 'latlong': geo_location.ll };
  } else {
    campaign_type.lastActivity = { 'ip': ip };
  }

  campaign_type.save(function (err) {
    if (err) {
      return res.status(422).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.json(campaign_type);
    }
  });
};

/**
 * Delete an campaign_type
 */
exports.delete = function (req, res) {
  var campaign_type = req.campaign_type;
  campaign_type.status = 'Deleted';

  campaign_type.save(function (err) {
    if (err) {
      return res.status(422).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.json(campaign_type);
    }
  });
};

/**
 * List of Campaign_types
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
  Campaign_type.find(req.query).sort('-created').populate('user', 'displayName').populate('productLineOption', 'name').exec(function (err, campaign_types) {
    if (err) {
      return res.status(422).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.json(campaign_types);
    }
  });
};

/**
 * Campaign_type middleware
 */
exports.campaign_typeByID = function (req, res, next, id) {

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).send({
      message: 'Character CTA is invalid'
    });
  }

  Campaign_type.findById(id).populate('user', 'displayName').populate('productLineOption', 'name').exec(function (err, campaign_type) {
    if (err) {
      return next(err);
    } else if (!campaign_type) {
      return res.status(404).send({
        message: 'No character CTA with that identifier has been found'
      });
    }
    req.campaign_type = campaign_type;
    next();
  });
};
