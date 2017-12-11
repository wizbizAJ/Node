(function () {
  'use strict';

  angular
    .module('colors')
    .run(menuConfig);

  menuConfig.$inject = ['menuService'];

  function menuConfig(menuService) {
    // menuService.addMenuItem('topbar', {
    //  title: 'Colors',
    //  state: 'colors',
    //  type: 'dropdown',
    //  roles: ['*']
    // });

    // Add the dropdown list item
    // menuService.addSubMenuItem('topbar', 'colors', {
    //  title: 'List Colors',
    //  state: 'colors.list',
    //  roles: ['*']
    // });
  }
}());
