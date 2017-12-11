(function () {
  'use strict';

  angular
    .module('advertisements')
    .run(menuConfig);

  menuConfig.$inject = ['menuService'];

  function menuConfig(menuService) {
    // menuService.addMenuItem('topbar', {
    //  title: 'Advertisements',
    //  state: 'advertisements',
    //  type: 'dropdown',
    //  roles: ['*']
    // });

    // Add the dropdown list item
    // menuService.addSubMenuItem('topbar', 'advertisements', {
    //  title: 'List Advertisements',
    //  state: 'advertisements.list',
    //  roles: ['*']
    // });
  }
}());
