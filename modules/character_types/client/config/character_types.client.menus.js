(function () {
  'use strict';

  angular
    .module('character_types')
    .run(menuConfig);

  menuConfig.$inject = ['menuService'];

  function menuConfig(menuService) {
    // menuService.addMenuItem('topbar', {
    //  title: 'Character_types',
    //  state: 'character_types',
    //  type: 'dropdown',
    //  roles: ['*']
    // });

    // Add the dropdown list item
    // menuService.addSubMenuItem('topbar', 'character_types', {
    //  title: 'List Character_types',
    //  state: 'character_types.list',
    //  roles: ['*']
    // });
  }
}());
