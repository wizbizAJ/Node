'use strict';

/**
 * Module dependencies
 */
var character_typesPolicy = require('../policies/character_types.server.policy'),
  character_types = require('../controllers/character_types.server.controller');

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
  app.route('/api/character_types').all(hasPermission(['canViewCharacter Type'])).get(character_types.list);
  app.route('/api/character_types').all(hasPermission(['canCreateCharacter Type'])).post(character_types.create);
  // Single character_type routes
  app.route('/api/character_types/:character_typeId').all(hasPermission(['canEditCharacter Type'])).get(character_types.read);
  app.route('/api/character_types/:character_typeId').all(hasPermission(['canEditCharacter Type'])).put(character_types.update);
  app.route('/api/character_types/:character_typeId').all(hasPermission(['canDeleteCharacter Type'])).delete(character_types.delete);

  // Finish by binding the character_type middleware
  app.param('character_typeId', character_types.character_typeByID);
};
