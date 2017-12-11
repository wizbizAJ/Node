'use strict';

/**
 * Module dependencies
 */
var path = require('path'),
  mongoose = require('mongoose'),
  geoip = require('geoip-lite'),
  Article = mongoose.model('Article'),
  errorHandler = require(path.resolve('./modules/core/server/controllers/errors.server.controller'));

/**
 * Create an article
 */
exports.create = function (req, res) {
  var article = new Article(req.body);
  article.user = req.user;
  article.updated = Date.now();

  var ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress || req.socket.remoteAddress || req.connection.socket.remoteAddress;
  var geo_location = geoip.lookup(ip);
  if (geo_location) {
    article.lastActivity = { 'ip': ip, 'country': geo_location.country, 'city': geo_location.city, 'latlong': geo_location.ll };
  } else {
    article.lastActivity = { 'ip': ip };
  }

  article.save(function (err) {
    if (err) {
      return res.status(422).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.json(article);
    }
  });
};

/**
 * Show the current article
 */
exports.read = function (req, res) {
  // convert mongoose document to JSON
  var article = req.article ? req.article.toJSON() : {};

  // Add a custom field to the Article, for determining if the current User is the "owner".
  // NOTE: This field is NOT persisted to the database, since it doesn't exist in the Article model.
  article.isCurrentUserOwner = !!(req.user && article.user && article.user._id.toString() === req.user._id.toString());

  res.json(article);
};

/**
 * Update an article
 */
exports.update = function (req, res) {
  var article = req.article;

  article.name = req.body.name;
  article.status = req.body.status;
  article.lookupcategory = req.body.lookupcategory;
  article.description = req.body.description;
  article.updated = Date.now();

  var ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress || req.socket.remoteAddress || req.connection.socket.remoteAddress;
  var geo_location = geoip.lookup(ip);
  if (geo_location) {
    article.lastActivity = { 'ip': ip, 'country': geo_location.country, 'city': geo_location.city, 'latlong': geo_location.ll };
  } else {
    article.lastActivity = { 'ip': ip };
  }

  article.save(function (err) {
    if (err) {
      return res.status(422).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.json(article);
    }
  });
};

/**
 * Delete an article
 */
exports.delete = function (req, res) {
  var article = req.article;
  article.status = 'Deleted';

  article.save(function (err) {
    if (err) {
      return res.status(422).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.json(article);
    }
  });
};

/**
 * List of Articles
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
  Article.find(req.query).sort('-created').populate('user', 'displayName').exec(function (err, articles) {
    if (err) {
      return res.status(422).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.json(articles);
    }
  });
};

/**
 * Article middleware
 */
exports.articleByID = function (req, res, next, id) {

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).send({
      message: 'Article is invalid'
    });
  }

  Article.findById(id).populate('user', 'displayName').populate('lookupcategory', 'name').exec(function (err, article) {
    if (err) {
      return next(err);
    } else if (!article) {
      return res.status(404).send({
        message: 'No article with that identifier has been found'
      });
    }
    req.article = article;
    next();
  });
};
