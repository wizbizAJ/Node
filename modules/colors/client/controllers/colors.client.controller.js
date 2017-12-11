(function () {
  'use strict';

  angular
    .module('colors')
    .controller('ColorsController', ColorsController);

  ColorsController.$inject = ['$scope', 'colorResolve', 'Authentication'];

  function ColorsController($scope, color, Authentication) {
    var vm = this;

    vm.color = color;
    vm.authentication = Authentication;

  }
}());
