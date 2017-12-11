(function () {
  'use strict';

  angular
    .module('campaign_types.routes')
    .config(routeConfig);

  routeConfig.$inject = ['$stateProvider'];

  function routeConfig($stateProvider) {
    $stateProvider
      .state('campaign_types', {
        abstract: true,
        url: '/campaign_types',
        template: '<ui-view/>'
      })
      .state('campaign_types.list', {
        url: '',
        templateUrl: '/modules/campaign_types/client/views/list-campaign_types.client.view.html',
        controller: 'Campaign_typesListController',
        controllerAs: 'vm',
        data: {
          pageTitle: 'Campaign_types List'
        }
      })
      .state('campaign_types.view', {
        url: '/:campaign_typeId',
        templateUrl: '/modules/campaign_types/client/views/view-campaign_type.client.view.html',
        controller: 'Campaign_typesController',
        controllerAs: 'vm',
        resolve: {
          campaign_typeResolve: getCampaign_type
        },
        data: {
          pageTitle: 'Campaign_type {{ campaign_typeResolve.title }}'
        }
      });
  }

  getCampaign_type.$inject = ['$stateParams', 'Campaign_typesService'];

  function getCampaign_type($stateParams, Campaign_typesService) {
    return Campaign_typesService.get({
      campaign_typeId: $stateParams.campaign_typeId
    }).$promise;
  }
}());
