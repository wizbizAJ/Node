(function () {
  'use strict';

  angular
    .module('campaign_types')
    .controller('Campaign_typesListController', Campaign_typesListController);

  Campaign_typesListController.$inject = ['Campaign_typesService'];

  function Campaign_typesListController(Campaign_typesService) {
    var vm = this;

    vm.campaign_types = Campaign_typesService.query();
  }
}());
