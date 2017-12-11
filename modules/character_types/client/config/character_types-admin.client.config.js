(function () {
  'use strict';

  // Configuring the Character_types Admin module
  angular
    .module('character_types.admin')
    .run(menuConfig);

  menuConfig.$inject = ['menuService'];

  function menuConfig(Menus) {
    Menus.addSubMenuItem('topbar', 'masters', {
      title: 'Celebrity Type',
      state: 'admincharacter_types',
      params: {
        class: 'dropdown-submenu',
        type: 'dropdown'
      },
      roles: ['admin', 'user'],
      permissions: ['canViewCharacter Type', 'canCreateCharacter Type']
    });

    Menus.addSubSubMenuItem('topbar', 'masters', 'admincharacter_types', {
      title: 'List Celebrity Type',
      state: 'admin.character_types.list',
      roles: ['admin', 'user'],
      permissions: ['canViewCharacter Type']
    });

    Menus.addSubSubMenuItem('topbar', 'masters', 'admincharacter_types', {
      title: 'Add Celebrity Type',
      state: 'admin.character_types.create',
      roles: ['admin', 'user'],
      permissions: ['canCreateCharacter Type']
    });
  }
}());
