(function () {
  'use strict';

  angular
    .module('colors.admin.routes')
    .config(routeConfig);

  routeConfig.$inject = ['$stateProvider'];

  function routeConfig($stateProvider) {
    $stateProvider
      .state('admin.colors', {
        abstract: true,
        url: '/colors',
        template: '<ui-view/>'
      })
      .state('admin.colors.list', {
        url: '',
        templateUrl: '/modules/colors/client/views/admin/list-colors.client.view.html',
        controller: 'ColorsAdminListController',
        controllerAs: 'vm',
        data: {
          roles: ['admin']
        }
      })
      .state('admin.colors.create', {
        url: '/create',
        templateUrl: '/modules/colors/client/views/admin/form-color.client.view.html',
        controller: 'ColorsAdminController',
        controllerAs: 'vm',
        data: {
          roles: ['admin']
        },
        resolve: {
          colorResolve: newColor
        }
      })
      .state('admin.colors.edit', {
        url: '/:colorId/edit',
        templateUrl: '/modules/colors/client/views/admin/form-color.client.view.html',
        controller: 'ColorsAdminController',
        controllerAs: 'vm',
        data: {
          roles: ['admin']
        },
        resolve: {
          colorResolve: getColor
        }
      });
  }

  getColor.$inject = ['$stateParams', 'ColorsService'];

  function getColor($stateParams, ColorsService) {
    return ColorsService.get({
      colorId: $stateParams.colorId
    }).$promise;
  }

  newColor.$inject = ['ColorsService'];

  function newColor(ColorsService) {
    return new ColorsService();
  }
}());
