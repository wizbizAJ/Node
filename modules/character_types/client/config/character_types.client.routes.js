(function () {
  'use strict';

  angular
    .module('character_types.routes')
    .config(routeConfig);

  routeConfig.$inject = ['$stateProvider'];

  function routeConfig($stateProvider) {
    $stateProvider
      .state('character_types', {
        abstract: true,
        url: '/character_types',
        template: '<ui-view/>'
      })
      .state('character_types.list', {
        url: '',
        templateUrl: '/modules/character_types/client/views/list-character_types.client.view.html',
        controller: 'Character_typesListController',
        controllerAs: 'vm',
        data: {
          pageTitle: 'Character_types List'
        }
      })
      .state('character_types.view', {
        url: '/:character_typeId',
        templateUrl: '/modules/character_types/client/views/view-character_type.client.view.html',
        controller: 'Character_typesController',
        controllerAs: 'vm',
        resolve: {
          character_typeResolve: getCharacter_type
        },
        data: {
          pageTitle: 'Character_type {{ character_typeResolve.title }}'
        }
      });
  }

  getCharacter_type.$inject = ['$stateParams', 'Character_typesService'];

  function getCharacter_type($stateParams, Character_typesService) {
    return Character_typesService.get({
      character_typeId: $stateParams.character_typeId
    }).$promise;
  }
}());
