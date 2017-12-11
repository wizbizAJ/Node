(function () {
  'use strict';

  angular
    .module('colors.routes')
    .config(routeConfig);

  routeConfig.$inject = ['$stateProvider'];

  function routeConfig($stateProvider) {
    $stateProvider
      .state('colors', {
        abstract: true,
        url: '/colors',
        template: '<ui-view/>'
      })
      .state('colors.list', {
        url: '',
        templateUrl: '/modules/colors/client/views/list-colors.client.view.html',
        controller: 'ColorsListController',
        controllerAs: 'vm',
        data: {
          pageTitle: 'Colors List'
        }
      })
      .state('colors.view', {
        url: '/:colorId',
        templateUrl: '/modules/colors/client/views/view-color.client.view.html',
        controller: 'ColorsController',
        controllerAs: 'vm',
        resolve: {
          colorResolve: getColor
        },
        data: {
          pageTitle: 'Color {{ colorResolve.title }}'
        }
      });
  }

  getColor.$inject = ['$stateParams', 'ColorsService'];

  function getColor($stateParams, ColorsService) {
    return ColorsService.get({
      colorId: $stateParams.colorId
    }).$promise;
  }
}());
