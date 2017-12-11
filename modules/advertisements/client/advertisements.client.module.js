(function (app) {
  'use strict';

  app.registerModule('advertisements', ['core']);// The core module is required for special route handling; see /core/client/config/core.client.routes
  app.registerModule('advertisements.admin', ['core.admin']);
  app.registerModule('advertisements.admin.routes', ['core.admin.routes']);
  app.registerModule('advertisements.services');
  app.registerModule('advertisements.routes', ['ui.router', 'core.routes', 'advertisements.services']);
}(ApplicationConfiguration));
