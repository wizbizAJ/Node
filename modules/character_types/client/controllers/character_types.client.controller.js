(function () {
  'use strict';

  angular
    .module('character_types')
    .controller('Character_typesController', Character_typesController);

  Character_typesController.$inject = ['$scope', 'character_typeResolve', 'Authentication'];

  function Character_typesController($scope, character_type, Authentication) {
    var vm = this;

    vm.character_type = character_type;
    vm.authentication = Authentication;

  }
}());
