'use strict';

/**
 * Module dependencies
 */
var acl = require('acl');

// Using the memory backend
acl = new acl(new acl.memoryBackend());

/**
 * Invoke Advertisements Permissions
 */
exports.invokeRolesPolicies = function () {
  acl.allow([{
    roles: ['admin'],
    allows: [{
      resources: '/api/advertisements',
      permissions: '*'
    }, {
      resources: '/api/advertisements/:advertisementId',
      permissions: '*'
    }]
  }, {
    roles: ['user'],
    allows: [{
      resources: '/api/advertisements',
      permissions: ['get']
    }, {
      resources: '/api/advertisements/:advertisementId',
      permissions: ['get']
    }]
  }, {
    roles: ['guest'],
    allows: [{
      resources: '/api/advertisements',
      permissions: ['get']
    }, {
      resources: '/api/advertisements/:advertisementId',
      permissions: ['get']
    }]
  }]);
};

/**
 * Check If Advertisements Policy Allows
 */
exports.isAllowed = function (req, res, next) {
  var roles = (req.user) ? req.user.roles : ['guest'];

  // If an advertisement is being processed and the current user created it then allow any manipulation
  if (req.advertisement && req.user && req.advertisement.user && req.advertisement.user.id === req.user.id) {
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
