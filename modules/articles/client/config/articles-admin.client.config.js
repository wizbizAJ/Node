(function () {
  'use strict';

  // Configuring the Articles Admin module
  angular
    .module('articles.admin')
    .run(menuConfig);

  menuConfig.$inject = ['menuService'];

  function menuConfig(Menus) {
    Menus.addSubMenuItem('topbar', 'masters', {
      title: 'Article',
      state: 'adminarticles',
      params: {
        class: 'dropdown-submenu',
        type: 'dropdown'
      },
      roles: ['admin', 'user'],
      permissions: ['canViewArticle', 'canCreateArticle']
    });

    Menus.addSubSubMenuItem('topbar', 'masters', 'adminarticles', {
      title: 'List Article',
      state: 'admin.articles.list',
      roles: ['admin', 'user'],
      permissions: ['canViewArticle']
    });

    Menus.addSubSubMenuItem('topbar', 'masters', 'adminarticles', {
      title: 'Add Article',
      state: 'admin.articles.create',
      roles: ['admin', 'user'],
      permissions: ['canCreateArticle']
    });
  }
}());
