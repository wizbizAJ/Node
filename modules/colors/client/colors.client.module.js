(function (app) {
  'use strict';

  app.registerModule('colors', ['core']);// The core module is required for special route handling; see /core/client/config/core.client.routes
  app.registerModule('colors.admin', ['core.admin']);
  app.registerModule('colors.admin.routes', ['core.admin.routes']);
  app.registerModule('colors.services');
  app.registerModule('colors.routes', ['ui.router', 'core.routes', 'colors.services']);
}(ApplicationConfiguration));
