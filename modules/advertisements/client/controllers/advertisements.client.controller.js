(function () {
  'use strict';

  angular
    .module('advertisements')
    .controller('AdvertisementsController', AdvertisementsController);

  AdvertisementsController.$inject = ['$scope', 'advertisementResolve', 'Authentication'];

  function AdvertisementsController($scope, advertisement, Authentication) {
    var vm = this;

    vm.advertisement = advertisement;
    vm.authentication = Authentication;

  }
}());
