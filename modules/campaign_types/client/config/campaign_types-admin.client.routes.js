(function () {
  'use strict';

  angular
    .module('campaign_types.admin.routes')
    .config(routeConfig);

  routeConfig.$inject = ['$stateProvider'];

  function routeConfig($stateProvider) {
    $stateProvider
      .state('admin.campaign_types', {
        abstract: true,
        url: '/campaign_types',
        template: '<ui-view/>'
      })
      .state('admin.campaign_types.list', {
        url: '',
        templateUrl: '/modules/campaign_types/client/views/admin/list-campaign_types.client.view.html',
        controller: 'Campaign_typesAdminListController',
        controllerAs: 'vm',
        data: {
          roles: ['admin']
        }
      })
      .state('admin.campaign_types.create', {
        url: '/create',
        templateUrl: '/modules/campaign_types/client/views/admin/form-campaign_type.client.view.html',
        controller: 'Campaign_typesAdminController',
        controllerAs: 'vm',
        data: {
          roles: ['admin']
        },
        resolve: {
          campaign_typeResolve: newCampaign_type
        }
      })
      .state('admin.campaign_types.edit', {
        url: '/:campaign_typeId/edit',
        templateUrl: '/modules/campaign_types/client/views/admin/form-campaign_type.client.view.html',
        controller: 'Campaign_typesAdminController',
        controllerAs: 'vm',
        data: {
          roles: ['admin']
        },
        resolve: {
          campaign_typeResolve: getCampaign_type
        }
      });
  }

  getCampaign_type.$inject = ['$stateParams', 'Campaign_typesService'];

  function getCampaign_type($stateParams, Campaign_typesService) {
    return Campaign_typesService.get({
      campaign_typeId: $stateParams.campaign_typeId
    }).$promise;
  }

  newCampaign_type.$inject = ['Campaign_typesService'];

  function newCampaign_type(Campaign_typesService) {
    return new Campaign_typesService();
  }
}());
