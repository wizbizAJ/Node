(function () {
  'use strict';

  angular
    .module('campaign_types')
    .run(menuConfig);

  menuConfig.$inject = ['menuService'];

  function menuConfig(menuService) {
    // menuService.addMenuItem('topbar', {
    //  title: 'Campaign_types',
    //  state: 'campaign_types',
    //  type: 'dropdown',
    //  roles: ['*']
    // });

    // Add the dropdown list item
    // menuService.addSubMenuItem('topbar', 'campaign_types', {
    //  title: 'List Campaign_types',
    //  state: 'campaign_types.list',
    //  roles: ['*']
    // });
  }
}());
