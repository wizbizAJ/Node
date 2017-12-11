(function () {
  'use strict';

  angular
    .module('advertisements.routes')
    .config(routeConfig);

  routeConfig.$inject = ['$stateProvider'];

  function routeConfig($stateProvider) {
    $stateProvider
      .state('advertisements', {
        abstract: true,
        url: '/advertisements',
        template: '<ui-view/>'
      })
      .state('advertisements.list', {
        url: '',
        templateUrl: '/modules/advertisements/client/views/list-advertisements.client.view.html',
        controller: 'AdvertisementsListController',
        controllerAs: 'vm',
        data: {
          pageTitle: 'Advertisements List'
        }
      })
      .state('advertisements.view', {
        url: '/:advertisementId',
        templateUrl: '/modules/advertisements/client/views/view-advertisement.client.view.html',
        controller: 'AdvertisementsController',
        controllerAs: 'vm',
        resolve: {
          advertisementResolve: getAdvertisement
        },
        data: {
          pageTitle: 'Advertisement {{ advertisementResolve.title }}'
        }
      });
  }

  getAdvertisement.$inject = ['$stateParams', 'AdvertisementsService'];

  function getAdvertisement($stateParams, AdvertisementsService) {
    return AdvertisementsService.get({
      advertisementId: $stateParams.advertisementId
    }).$promise;
  }
}());
