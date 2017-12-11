'use strict';

/**
 * Module dependencies
 */
var acl = require('acl');

// Using the memory backend
acl = new acl(new acl.memoryBackend());

/**
 * Invoke Campaign_types Permissions
 */
exports.invokeRolesPolicies = function () {
  acl.allow([{
    roles: ['admin'],
    allows: [{
      resources: '/api/campaign_types',
      permissions: '*'
    }, {
      resources: '/api/campaign_types/:campaign_typeId',
      permissions: '*'
    }]
  }, {
    roles: ['user'],
    allows: [{
      resources: '/api/campaign_types',
      permissions: ['get']
    }, {
      resources: '/api/campaign_types/:campaign_typeId',
      permissions: ['get']
    }]
  }, {
    roles: ['guest'],
    allows: [{
      resources: '/api/campaign_types',
      permissions: ['get']
    }, {
      resources: '/api/campaign_types/:campaign_typeId',
      permissions: ['get']
    }]
  }]);
};

/**
 * Check If Campaign_types Policy Allows
 */
exports.isAllowed = function (req, res, next) {
  var roles = (req.user) ? req.user.roles : ['guest'];

  // If an campaign_type is being processed and the current user created it then allow any manipulation
  if (req.campaign_type && req.user && req.campaign_type.user && req.campaign_type.user.id === req.user.id) {
    return next();
  }

  // Check for user roles
  acl.areAnyRolesAllowed(roles, req.route.path, req.method.toLowerCase(), function (err, isAllowed) {
    if (err) {
      // An authorization error occurred
      return res.status(500).send('Unexpected authorization error');
    } else {
      if (isAllowed) {
        // Access granted! Invoke next middleware
        return next();
      } else {
        return res.status(403).json({
          message: 'User is not authorized'
        });
      }
    }
  });
};
