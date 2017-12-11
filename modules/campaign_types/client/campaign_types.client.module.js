(function (app) {
  'use strict';

  app.registerModule('campaign_types', ['core']);// The core module is required for special route handling; see /core/client/config/core.client.routes
  app.registerModule('campaign_types.admin', ['core.admin']);
  app.registerModule('campaign_types.admin.routes', ['core.admin.routes']);
  app.registerModule('campaign_types.services');
  app.registerModule('campaign_types.routes', ['ui.router', 'core.routes', 'campaign_types.services']);
}(ApplicationConfiguration));
