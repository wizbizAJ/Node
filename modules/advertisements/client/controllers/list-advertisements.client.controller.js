(function () {
  'use strict';

  angular
    .module('advertisements')
    .controller('AdvertisementsListController', AdvertisementsListController);

  AdvertisementsListController.$inject = ['AdvertisementsService'];

  function AdvertisementsListController(AdvertisementsService) {
    var vm = this;

    vm.advertisements = AdvertisementsService.query();
  }
}());
