(function () {
  'use strict';

  // Configuring the Departments Admin module
  angular
    .module('departments.admin')
    .run(menuConfig);

  menuConfig.$inject = ['menuService'];

  function menuConfig(Menus) {
    Menus.addSubMenuItem('topbar', 'admin', {
      title: 'Department',
      state: 'admindepartments',
      params: {
        class: 'dropdown-submenu',
        type: 'dropdown'
      },
      roles: ['admin', 'user'],
      permissions: ['canViewDepartment', 'canCreateDepartment']
    });

    Menus.addSubSubMenuItem('topbar', 'admin', 'admindepartments', {
      title: 'List Department',
      state: 'admin.departments.list',
      roles: ['admin', 'user'],
      permissions: ['canViewDepartment']
    });

    Menus.addSubSubMenuItem('topbar', 'admin', 'admindepartments', {
      title: 'Add Department',
      state: 'admin.departments.create',
      roles: ['admin', 'user'],
      permissions: ['canCreateDepartment']
    });
  }
}());
