'use strict';

/**
 * Module dependencies
 */
var advertisementsPolicy = require('../policies/advertisements.server.policy'),
  advertisements = require('../controllers/advertisements.server.controller');

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
  app.route('/api/advertisements').all(hasPermission(['canViewAdvertisement'])).get(advertisements.list);
  app.route('/api/advertisements').all(hasPermission(['canCreateAdvertisement'])).post(advertisements.create);
  // Single advertisement routes
  app.route('/api/advertisements/:advertisementId').all(hasPermission(['canEditAdvertisement'])).get(advertisements.read);
  app.route('/api/advertisements/:advertisementId').all(hasPermission(['canEditAdvertisement'])).put(advertisements.update);
  app.route('/api/advertisements/:advertisementId').all(hasPermission(['canDeleteAdvertisement'])).delete(advertisements.delete);

  // Finish by binding the advertisement middleware
  app.param('advertisementId', advertisements.advertisementByID);
};
