(function () {
  'use strict';

  angular
    .module('departments')
    .run(menuConfig);

  menuConfig.$inject = ['menuService'];

  function menuConfig(menuService) {
    // menuService.addMenuItem('topbar', {
    //  title: 'Departments',
    //  state: 'departments',
    //  type: 'dropdown',
    //  roles: ['*']
    // });

    // Add the dropdown list item
    // menuService.addSubMenuItem('topbar', 'departments', {
    //  title: 'List Departments',
    //  state: 'departments.list',
    //  roles: ['*']
    // });
  }
}());
