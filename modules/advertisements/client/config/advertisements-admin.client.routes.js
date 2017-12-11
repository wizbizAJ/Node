(function () {
  'use strict';

  angular
    .module('advertisements.admin.routes')
    .config(routeConfig);

  routeConfig.$inject = ['$stateProvider'];

  function routeConfig($stateProvider) {
    $stateProvider
      .state('admin.advertisements', {
        abstract: true,
        url: '/advertisements',
        template: '<ui-view/>'
      })
      .state('admin.advertisements.list', {
        url: '',
        templateUrl: '/modules/advertisements/client/views/admin/list-advertisements.client.view.html',
        controller: 'AdvertisementsAdminListController',
        controllerAs: 'vm',
        data: {
          roles: ['admin']
        }
      })
      .state('admin.advertisements.create', {
        url: '/create',
        templateUrl: '/modules/advertisements/client/views/admin/form-advertisement.client.view.html',
        controller: 'AdvertisementsAdminController',
        controllerAs: 'vm',
        data: {
          roles: ['admin']
        },
        resolve: {
          advertisementResolve: newAdvertisement
        }
      })
      .state('admin.advertisements.edit', {
        url: '/:advertisementId/edit',
        templateUrl: '/modules/advertisements/client/views/admin/form-advertisement.client.view.html',
        controller: 'AdvertisementsAdminController',
        controllerAs: 'vm',
        data: {
          roles: ['admin']
        },
        resolve: {
          advertisementResolve: getAdvertisement
        }
      });
  }

  getAdvertisement.$inject = ['$stateParams', 'AdvertisementsService'];

  function getAdvertisement($stateParams, AdvertisementsService) {
    return AdvertisementsService.get({
      advertisementId: $stateParams.advertisementId
    }).$promise;
  }

  newAdvertisement.$inject = ['AdvertisementsService'];

  function newAdvertisement(AdvertisementsService) {
    return new AdvertisementsService();
  }
}());
