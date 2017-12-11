(function () {
  'use strict';

  // Configuring the Colors Admin module
  angular
    .module('colors.admin')
    .run(menuConfig);

  menuConfig.$inject = ['menuService'];

  function menuConfig(Menus) {
    Menus.addSubMenuItem('topbar', 'masters', {
      title: 'Color',
      state: 'admincolors',
      params: {
        class: 'dropdown-submenu',
        type: 'dropdown'
      },
      roles: ['admin', 'user'],
      permissions: ['canViewColor', 'canCreateColor']
    });

    Menus.addSubSubMenuItem('topbar', 'masters', 'admincolors', {
      title: 'List Color',
      state: 'admin.colors.list',
      roles: ['admin', 'user'],
      permissions: ['canViewColor']
    });

    Menus.addSubSubMenuItem('topbar', 'masters', 'admincolors', {
      title: 'Add Color',
      state: 'admin.colors.create',
      roles: ['admin', 'user'],
      permissions: ['canCreateColor']
    });
  }
}());
