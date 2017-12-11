'use strict';

/**
 * Module dependencies
 */
var campaign_typesPolicy = require('../policies/campaign_types.server.policy'),
  campaign_types = require('../controllers/campaign_types.server.controller');

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
  app.route('/api/campaign_types').all(hasPermission(['canViewCampaign Type'])).get(campaign_types.list);
  app.route('/api/campaign_types').all(hasPermission(['canCreateCampaign Type'])).post(campaign_types.create);
  // Single campaign_type routes
  app.route('/api/campaign_types/:campaign_typeId').all(hasPermission(['canEditCampaign Type'])).get(campaign_types.read);
  app.route('/api/campaign_types/:campaign_typeId').all(hasPermission(['canEditCampaign Type'])).put(campaign_types.update);
  app.route('/api/campaign_types/:campaign_typeId').all(hasPermission(['canDeleteCampaign Type'])).delete(campaign_types.delete);

  // Finish by binding the campaign_type middleware
  app.param('campaign_typeId', campaign_types.campaign_typeByID);
};
