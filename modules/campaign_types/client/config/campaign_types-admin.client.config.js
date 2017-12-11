(function () {
  'use strict';

  // Configuring the Campaign_types Admin module
  angular
    .module('campaign_types.admin')
    .run(menuConfig);

  menuConfig.$inject = ['menuService'];

  function menuConfig(Menus) {
    Menus.addSubMenuItem('topbar', 'masters', {
      title: 'Campaign CTA',
      state: 'admincampaign_types',
      params: {
        class: 'dropdown-submenu',
        type: 'dropdown'
      },
      roles: ['admin', 'user'],
      permissions: ['canViewCampaign Type', 'canCreateCampaign Type']
    });

    Menus.addSubSubMenuItem('topbar', 'masters', 'admincampaign_types', {
      title: 'List Campaign CTA',
      state: 'admin.campaign_types.list',
      roles: ['admin', 'user'],
      permissions: ['canViewCampaign Type']
    });

    Menus.addSubSubMenuItem('topbar', 'masters', 'admincampaign_types', {
      title: 'Add Campaign CTA',
      state: 'admin.campaign_types.create',
      roles: ['admin', 'user'],
      permissions: ['canCreateCampaign Type']
    });
  }
}());
