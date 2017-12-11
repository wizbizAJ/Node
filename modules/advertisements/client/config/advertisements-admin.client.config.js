(function () {
  'use strict';

  // Configuring the Advertisements Admin module
  angular
    .module('advertisements.admin')
    .run(menuConfig);

  menuConfig.$inject = ['menuService'];

  function menuConfig(Menus) {
    Menus.addSubMenuItem('topbar', 'management', {
      title: 'Advertisements',
      state: 'adminadvertisements',
      params: {
        class: 'dropdown-submenu',
        type: 'dropdown'
      },
      roles: ['admin', 'user'],
      permissions: ['canViewAdvertisement', 'canCreateAdvertisement']
    });

    Menus.addSubSubMenuItem('topbar', 'management', 'adminadvertisements', {
      title: 'List Advertisements',
      state: 'admin.advertisements.list',
      roles: ['admin', 'user'],
      permissions: ['canViewAdvertisement']
    });

    Menus.addSubSubMenuItem('topbar', 'management', 'adminadvertisements', {
      title: 'Add Advertisements',
      state: 'admin.advertisements.create',
      roles: ['admin', 'user'],
      permissions: ['canCreateAdvertisement']
    });
  }
}());
