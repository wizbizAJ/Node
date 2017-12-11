(function () {
  'use strict';

  angular
    .module('departments.admin.routes')
    .config(routeConfig);

  routeConfig.$inject = ['$stateProvider'];

  function routeConfig($stateProvider) {
    $stateProvider
      .state('admin.departments', {
        abstract: true,
        url: '/departments',
        template: '<ui-view/>'
      })
      .state('admin.departments.list', {
        url: '',
        templateUrl: '/modules/departments/client/views/admin/list-departments.client.view.html',
        controller: 'DepartmentsAdminListController',
        controllerAs: 'vm',
        data: {
          roles: ['admin']
        }
      })
      .state('admin.departments.create', {
        url: '/create',
        templateUrl: '/modules/departments/client/views/admin/form-department.client.view.html',
        controller: 'DepartmentsAdminController',
        controllerAs: 'vm',
        data: {
          roles: ['admin']
        },
        resolve: {
          departmentResolve: newDepartment
        }
      })
      .state('admin.departments.edit', {
        url: '/:departmentId/edit',
        templateUrl: '/modules/departments/client/views/admin/form-department.client.view.html',
        controller: 'DepartmentsAdminController',
        controllerAs: 'vm',
        data: {
          roles: ['admin']
        },
        resolve: {
          departmentResolve: getDepartment
        }
      });
  }

  getDepartment.$inject = ['$stateParams', 'DepartmentsService'];

  function getDepartment($stateParams, DepartmentsService) {
    return DepartmentsService.get({
      departmentId: $stateParams.departmentId
    }).$promise;
  }

  newDepartment.$inject = ['DepartmentsService'];

  function newDepartment(DepartmentsService) {
    return new DepartmentsService();
  }
}());
