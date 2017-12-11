(function () {
  'use strict';

  angular
    .module('departments.routes')
    .config(routeConfig);

  routeConfig.$inject = ['$stateProvider'];

  function routeConfig($stateProvider) {
    $stateProvider
      .state('departments', {
        abstract: true,
        url: '/departments',
        template: '<ui-view/>'
      })
      .state('departments.list', {
        url: '',
        templateUrl: '/modules/departments/client/views/list-departments.client.view.html',
        controller: 'DepartmentsListController',
        controllerAs: 'vm',
        data: {
          pageTitle: 'Departments List'
        }
      })
      .state('departments.view', {
        url: '/:departmentId',
        templateUrl: '/modules/departments/client/views/view-department.client.view.html',
        controller: 'DepartmentsController',
        controllerAs: 'vm',
        resolve: {
          departmentResolve: getDepartment
        },
        data: {
          pageTitle: 'Department {{ departmentResolve.title }}'
        }
      });
  }

  getDepartment.$inject = ['$stateParams', 'DepartmentsService'];

  function getDepartment($stateParams, DepartmentsService) {
    return DepartmentsService.get({
      departmentId: $stateParams.departmentId
    }).$promise;
  }
}());
