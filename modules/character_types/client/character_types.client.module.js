(function (app) {
  'use strict';

  app.registerModule('character_types', ['core']);// The core module is required for special route handling; see /core/client/config/core.client.routes
  app.registerModule('character_types.admin', ['core.admin']);
  app.registerModule('character_types.admin.routes', ['core.admin.routes']);
  app.registerModule('character_types.services');
  app.registerModule('character_types.routes', ['ui.router', 'core.routes', 'character_types.services']);
}(ApplicationConfiguration));
