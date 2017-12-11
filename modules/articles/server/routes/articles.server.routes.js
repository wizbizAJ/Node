'use strict';

/**
 * Module dependencies
 */
var articlesPolicy = require('../policies/articles.server.policy'),
  articles = require('../controllers/articles.server.controller');
//  articles1 = require('../controllers/apiarticles.server.controller');

var hasPermission = function(permission) {
  return function(req, res, next) {
    var flag = false;
    permission.forEach(function(p) {
      // if (req.user.permissions.indexOf(p) > -1 || req.user.isAdmin) {
      // console.log('Check Permission AJAY Patel :::: ' + req.user.permissions[p] + ' ::: ' + req.user.roles[0]);
      if (req.user.permissions[p] || req.user.roles[0] === 'admin') {
        flag = true;
        next();
      }
    });

    if (!flag) {
      // return res.send(401, 'User is not authorized');
      return res.status(403).json({
        message: 'User is not authorized'
      });
    }
  };
};
module.exports = function (app) {
  app.route('/api/articles').all(hasPermission(['canViewArticle'])).get(articles.list);
  app.route('/api/articles').all(hasPermission(['canCreateArticle'])).post(articles.create);
//  app.route('/mobile/articles').post(articles1.create);
//  app.route('/mobile/articles/list').get(articles1.list);
  // Single article routes
  app.route('/api/articles/:articleId').all(hasPermission(['canEditArticle'])).get(articles.read);
  app.route('/api/articles/:articleId').all(hasPermission(['canEditArticle'])).put(articles.update);
  app.route('/api/articles/:articleId').all(hasPermission(['canDeleteArticle'])).delete(articles.delete);

  // Finish by binding the article middleware
  app.param('articleId', articles.articleByID);
};
