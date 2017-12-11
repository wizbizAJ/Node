'use strict';

/**
 * Module dependencies
 */
var colorsPolicy = require('../policies/colors.server.policy'),
  colors = require('../controllers/colors.server.controller');
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
  // Colors collection routes
  /* app.route('/api/colors').all(colorsPolicy.isAllowed)
    .get(colors.list)
    .post(colors.create);*/
  app.route('/api/colors').all(hasPermission(['canViewColor'])).get(colors.list);
  app.route('/api/colors').all(hasPermission(['canCreateColor'])).post(colors.create);
  // Single color routes
  app.route('/api/colors/:colorId').all(hasPermission(['canEditColor'])).get(colors.read);
  app.route('/api/colors/:colorId').all(hasPermission(['canEditColor'])).put(colors.update);
  app.route('/api/colors/:colorId').all(hasPermission(['canDeleteColor'])).delete(colors.delete);

  // Finish by binding the color middleware
  app.param('colorId', colors.colorByID);
};
