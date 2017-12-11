(function (app) {
  'use strict';

  app.registerModule('departments', ['core']);// The core module is required for special route handling; see /core/client/config/core.client.routes
  app.registerModule('departments.admin', ['core.admin']);
  app.registerModule('departments.admin.routes', ['core.admin.routes']);
  app.registerModule('departments.services');
  app.registerModule('departments.routes', ['ui.router', 'core.routes', 'departments.services']);
}(ApplicationConfiguration));
