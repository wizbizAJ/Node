(function () {
  'use strict';

  angular
    .module('articles.admin')
    .controller('ArticlesAdminListController', ArticlesAdminListController);

  ArticlesAdminListController.$inject = ['$scope', '$state', '$window', '$filter', 'Authentication', 'ArticlesService', 'Notification', '$http', '$location'];

  function ArticlesAdminListController($scope, $state, $window, $filter, Authentication, ArticlesService, Notification, $http, $location) {
    var vm = this;
    vm.authentication = Authentication;
    vm.buildPager = buildPager;
    vm.figureOutItemsToDisplay = figureOutItemsToDisplay;
    vm.pageChanged = pageChanged;
    vm.remove = remove;
    vm.checkAll = checkAll;
    vm.removeCheck = removeCheck;
    vm.updateCheck = updateCheck;
    vm.updateStatus = updateStatus;
    vm.begin = 0;
    vm.end = 0;
    vm.itemsPerPage = '25';
    vm.itemsPerPageSelection = '25';
    vm.changePerPage = changePerPage;

    if (!vm.authentication.user) {
      $location.path('/authentication/signin');
    }
    // vm.articles = ArticlesService.query();

    ArticlesService.query({ status: { $ne: 'Deleted' } }, function (data) {
      vm.articles = data;
      angular.forEach(vm.articles, function (item, key) {
        vm.date1 = new Date(vm.articles[key].updated);
        vm.getDate = (vm.date1.getDate().toString().length <= 1) ? '0' + vm.date1.getDate() : vm.date1.getDate();
        vm.getMonth = ((vm.date1.getMonth() + 1).toString().length <= 1) ? '0' + (vm.date1.getMonth() + 1) : (vm.date1.getMonth() + 1);
        vm.articles[key].updatedFilter = vm.getDate + '-' + vm.getMonth + '-' + vm.date1.getFullYear();
      });
      vm.buildPager();
    });

    function changePerPage(perPage) {
      vm.itemsPerPageSelection = perPage;
      if (perPage === '-1') {
        vm.itemsPerPage = vm.currencys.length;
      } else {
        vm.itemsPerPage = perPage;
      }
      vm.buildPager();
    }

    function buildPager() {
      vm.pagedItems = [];
      vm.currentPage = 1;
      vm.figureOutItemsToDisplay();
    }

    function figureOutItemsToDisplay() {
      vm.filteredItems = $filter('filter')(vm.articles, {
        name: vm.name,
        updatedFilter: vm.updated
      });
      if (vm.status) {
        vm.filteredItems = $filter('filter')(vm.filteredItems, {
          status: vm.status
        }, true);
      }

      if (!vm.sort) {
        vm.sort = 'updated';
        vm.sortType = true;
      }
      vm.filteredItems = $filter('orderBy')(vm.filteredItems, vm.sort, vm.sortType);

      vm.filterLength = vm.filteredItems.length;
      vm.begin = ((vm.currentPage - 1) * parseInt(vm.itemsPerPage, 10));
      vm.end = vm.begin + parseInt(vm.itemsPerPage, 10);
      vm.pagedItems = vm.filteredItems.slice(vm.begin, vm.end);
    }

    function pageChanged() {
      vm.figureOutItemsToDisplay();
    }

    function remove(articles) {
      $window.swal({
        title: 'Are you sure?',
        text: 'Yes, Delete it!',
        type: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#DD6B55',
        confirmButtonText: 'Yes, delete it!',
        cancelButtonText: 'No, cancel plx!',
        closeOnConfirm: true,
        closeOnCancel: false
      }, function(isConfirm) {
        if (isConfirm) {
          articles.$remove(function() {
            $state.go('admin.articles.list', { }, { reload: true });
            Notification.success({ message: '<i class="glyphicon glyphicon-ok"></i> Article deleted successfully!' });
          });
        } else {
          $window.swal('Cancelled', 'Your Article is safe :)', 'error');
        }
      });
    }

    function checkAll() {
      if (vm.selectedAll) {
        vm.selectedAll = true;
      } else {
        vm.selectedAll = false;
      }
      angular.forEach(vm.pagedItems, function (item) {
        item.Selected = vm.selectedAll;
      });
    }

    function removeCheck() {
      var error = 0;
      angular.forEach(vm.pagedItems, function (item) {
        if (item.Selected) {
          error = 1;
        }
      });
      if (error === 0) {
        Notification.error({ message: '<i class="glyphicon glyphicon-remove"></i> Please select atleast one Article.' });
      } else {
        $window.swal({
          title: 'Are you sure?',
          text: 'Yes, Delete it!',
          type: 'warning',
          showCancelButton: true,
          confirmButtonColor: '#DD6B55',
          confirmButtonText: 'Yes, delete it!',
          cancelButtonText: 'No, cancel plx!',
          closeOnConfirm: true,
          closeOnCancel: false
        }, function(isConfirm) {
          if (isConfirm) {
            angular.forEach(vm.pagedItems, function (item) {
              if (item.Selected) {
                item.$remove();
              }
            });
            $state.go('admin.articles.list', { }, { reload: true });
            Notification.success({ message: '<i class="glyphicon glyphicon-ok"></i> Article deleted successfully!' });
          } else {
            $window.swal('Cancelled', 'Your Article is safe :)', 'error');
          }
        });
      }
    }

    function updateCheck(status) {
      var error = 0;
      angular.forEach(vm.pagedItems, function (item) {
        if (item.Selected) {
          error = 1;
        }
      });
      if (error === 0) {
        Notification.error({ message: '<i class="glyphicon glyphicon-remove"></i> Please select atleast one Article.' });
      } else {
        $window.swal({
          title: 'Are you sure?',
          text: 'Yes, Update it!',
          type: 'warning',
          showCancelButton: true,
          confirmButtonColor: '#DD6B55',
          confirmButtonText: 'Yes, update it!',
          cancelButtonText: 'No, cancel plx!',
          closeOnConfirm: true,
          closeOnCancel: false
        }, function(isConfirm) {
          if (isConfirm) {
            angular.forEach(vm.pagedItems, function (item) {
              if (item.Selected) {
                item.status = status;
                item.$update();
              }
            });
            Notification.success({ message: '<i class="glyphicon glyphicon-ok"></i> Article update successfully!' });
          } else {
            $window.swal('Cancelled', 'Your Article is safe :)', 'error');
          }
        });
      }
    }

    function updateStatus(article, status) {
      $window.swal({
        title: 'Are you sure?',
        text: 'Yes, Update it!',
        type: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#DD6B55',
        confirmButtonText: 'Yes, update it!',
        cancelButtonText: 'No, cancel plx!',
        closeOnConfirm: true,
        closeOnCancel: false
      }, function(isConfirm) {
        if (isConfirm) {
          article.status = status;
          article.$update();
          Notification.success({ message: '<i class="glyphicon glyphicon-ok"></i> Article update successfully!' });
        } else {
          $window.swal('Cancelled', 'Your Article is safe :)', 'error');
        }
      });
    }
  }
}());
