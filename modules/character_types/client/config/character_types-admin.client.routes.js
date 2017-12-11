(function () {
  'use strict';

  angular
    .module('character_types.admin.routes')
    .config(routeConfig);

  routeConfig.$inject = ['$stateProvider'];

  function routeConfig($stateProvider) {
    $stateProvider
      .state('admin.character_types', {
        abstract: true,
        url: '/character_types',
        template: '<ui-view/>'
      })
      .state('admin.character_types.list', {
        url: '',
        templateUrl: '/modules/character_types/client/views/admin/list-character_types.client.view.html',
        controller: 'Character_typesAdminListController',
        controllerAs: 'vm',
        data: {
          roles: ['admin']
        }
      })
      .state('admin.character_types.create', {
        url: '/create',
        templateUrl: '/modules/character_types/client/views/admin/form-character_type.client.view.html',
        controller: 'Character_typesAdminController',
        controllerAs: 'vm',
        data: {
          roles: ['admin']
        },
        resolve: {
          character_typeResolve: newCharacter_type
        }
      })
      .state('admin.character_types.edit', {
        url: '/:character_typeId/edit',
        templateUrl: '/modules/character_types/client/views/admin/form-character_type.client.view.html',
        controller: 'Character_typesAdminController',
        controllerAs: 'vm',
        data: {
          roles: ['admin']
        },
        resolve: {
          character_typeResolve: getCharacter_type
        }
      });
  }

  getCharacter_type.$inject = ['$stateParams', 'Character_typesService'];

  function getCharacter_type($stateParams, Character_typesService) {
    return Character_typesService.get({
      character_typeId: $stateParams.character_typeId
    }).$promise;
  }

  newCharacter_type.$inject = ['Character_typesService'];

  function newCharacter_type(Character_typesService) {
    return new Character_typesService();
  }
}());
