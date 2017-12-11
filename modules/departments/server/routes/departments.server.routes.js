'use strict';

/**
 * Module dependencies
 */
var departmentsPolicy = require('../policies/departments.server.policy'),
  departments = require('../controllers/departments.server.controller');

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
  app.route('/api/departments').all(hasPermission(['canViewDepartment'])).get(departments.list);
  app.route('/api/departments').all(hasPermission(['canCreateDepartment'])).post(departments.create);
  // Single department routes
  app.route('/api/departments/:departmentId').all(hasPermission(['canEditDepartment'])).get(departments.read);
  app.route('/api/departments/:departmentId').all(hasPermission(['canEditDepartment'])).put(departments.update);
  app.route('/api/departments/:departmentId').all(hasPermission(['canDeleteDepartment'])).delete(departments.delete);

  // Finish by binding the department middleware
  app.param('departmentId', departments.departmentByID);
};
