'use strict';

/**
 * Module dependencies
 */
var path = require('path'),
  mongoose = require('mongoose'),
  geoip = require('geoip-lite'),
  Advertisement = mongoose.model('Advertisement'),
  errorHandler = require(path.resolve('./modules/core/server/controllers/errors.server.controller'));

/**
 * Create an advertisement
 */
exports.create = function (req, res) {
  var advertisement = new Advertisement(req.body);
  advertisement.user = req.user;
  advertisement.updated = Date.now();
  console.log(req.body);
  var oldMedia = [];
  // for (var i=0; i<Object.keys(req.body.mediaSelector).length; i++) {

  var mediaImg;
  for (mediaImg in req.body.mediaSelector) {
    if (req.body.mediaSelector[mediaImg]) {
      oldMedia.push(req.body.mediaSelector[mediaImg]);
    }
  }
  if (mediaImg) {
    advertisement.mediaSelector = oldMedia;
  } else {
    advertisement.mediaSelector = req.body.mediaSelector;
  }
  var ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress || req.socket.remoteAddress || req.connection.socket.remoteAddress;
  var geo_location = geoip.lookup(ip);
  if (geo_location) {
    advertisement.lastActivity = { 'ip': ip, 'country': geo_location.country, 'city': geo_location.city, 'latlong': geo_location.ll };
  } else {
    advertisement.lastActivity = { 'ip': ip };
  }

  advertisement.save(function (err) {
    if (err) {
      return res.status(422).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.json(advertisement);
    }
  });
};

/**
 * Show the current advertisement
 */
exports.read = function (req, res) {
  // convert mongoose document to JSON
  var advertisement = req.advertisement ? req.advertisement.toJSON() : {};

  // Add a custom field to the Advertisement, for determining if the current User is the "owner".
  // NOTE: This field is NOT persisted to the database, since it doesn't exist in the Advertisement model.
  advertisement.isCurrentUserOwner = !!(req.user && advertisement.user && advertisement.user._id.toString() === req.user._id.toString());

  res.json(advertisement);
};

/**
 * Update an advertisement
 */
exports.update = function (req, res) {
  var advertisement = req.advertisement;

  advertisement.name = req.body.name;
  advertisement.productId = req.body.productId;
  advertisement.ar = req.body.ar;
  advertisement.durationTime = req.body.durationTime;
  advertisement.styleLookId = req.body.styleLookId;
  advertisement.option = req.body.option;
  advertisement.campaign_company = req.body.campaign_company;
  advertisement.type = req.body.type;
  advertisement.status = req.body.status;
  advertisement.description = req.body.description;
  advertisement.mediaSelector = req.body.mediaSelector;
  if (req.body.primaryMedia) {
    advertisement.primaryMedia = req.body.primaryMedia;
  } else {
    advertisement.primaryMedia = undefined;
  }
  advertisement.updated = Date.now();

  var ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress || req.socket.remoteAddress || req.connection.socket.remoteAddress;
  var geo_location = geoip.lookup(ip);
  if (geo_location) {
    advertisement.lastActivity = { 'ip': ip, 'country': geo_location.country, 'city': geo_location.city, 'latlong': geo_location.ll };
  } else {
    advertisement.lastActivity = { 'ip': ip };
  }

  advertisement.save(function (err) {
    if (err) {
      return res.status(422).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.json(advertisement);
    }
  });
};

/**
 * Delete an advertisement
 */
exports.delete = function (req, res) {
  var advertisement = req.advertisement;
  advertisement.status = 'Deleted';

  advertisement.save(function (err) {
    if (err) {
      return res.status(422).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.json(advertisement);
    }
  });
};

/**
 * List of Advertisements
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
  Advertisement.find(req.query).sort('-created').populate('user', 'displayName').populate('campaign_company', 'name', { status: 'Active' }).populate('type', 'name', { status: 'Active' }).populate('styleLookId', 'name', { status: 'Active' }).populate('productId', 'name', { status: 'Active' }).exec(function (err, advertisements) {
    if (err) {
      return res.status(422).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.json(advertisements);
    }
  });
};

/**
 * Advertisement middleware
 */
exports.advertisementByID = function (req, res, next, id) {

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).send({
      message: 'Advertisement is invalid'
    });
  }

  Advertisement.findById(id).populate('user', 'displayName').populate('campaign_company', 'name', { status: 'Active' }).populate('productId', 'name', { status: 'Active' }).populate('type', 'name', { status: 'Active' }).populate('styleLookId', 'name', { status: 'Active' }).exec(function (err, advertisement) {
    if (err) {
      return next(err);
    } else if (!advertisement) {
      return res.status(404).send({
        message: 'No advertisement with that identifier has been found'
      });
    }
    req.advertisement = advertisement;
    next();
  });
};
