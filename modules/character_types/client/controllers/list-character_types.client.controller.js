(function () {
  'use strict';

  angular
    .module('character_types')
    .controller('Character_typesListController', Character_typesListController);

  Character_typesListController.$inject = ['Character_typesService'];

  function Character_typesListController(Character_typesService) {
    var vm = this;

    vm.character_types = Character_typesService.query();
  }
}());
