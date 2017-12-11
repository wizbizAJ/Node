(function () {
  'use strict';

  angular
    .module('campaign_types')
    .controller('Campaign_typesController', Campaign_typesController);

  Campaign_typesController.$inject = ['$scope', 'campaign_typeResolve', 'Authentication'];

  function Campaign_typesController($scope, campaign_type, Authentication) {
    var vm = this;

    vm.campaign_type = campaign_type;
    vm.authentication = Authentication;

  }
}());
