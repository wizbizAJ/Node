(function () {
  'use strict';

  angular
    .module('colors.admin')
    .controller('ColorsAdminListController', ColorsAdminListController);

  ColorsAdminListController.$inject = ['$scope', '$state', '$window', '$filter', 'ColorsService', 'Authentication', 'Notification', '$http', '$location'];

  function ColorsAdminListController($scope, $state, $window, $filter, ColorsService, Authentication, Notification, $http, $location) {
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
    // vm.colors = ColorsService.query();

    ColorsService.query({ status: { $ne: 'Deleted' } }, function (data) {
      vm.colors = data;
      angular.forEach(vm.colors, function (item, key) {
        vm.date1 = new Date(vm.colors[key].updated);
        vm.getDate = (vm.date1.getDate().toString().length <= 1) ? '0' + vm.date1.getDate() : vm.date1.getDate();
        vm.getMonth = ((vm.date1.getMonth() + 1).toString().length <= 1) ? '0' + (vm.date1.getMonth() + 1) : (vm.date1.getMonth() + 1);
        vm.colors[key].updatedFilter = vm.getDate + '-' + vm.getMonth + '-' + vm.date1.getFullYear();
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
      vm.filteredItems = $filter('filter')(vm.colors, {
        name: vm.name,
        hcode: vm.hcode,
        rgbcode: vm.rgbcode,
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

    function remove(colors) {
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
          colors.$remove(function() {
            $state.go('admin.colors.list', { }, { reload: true });
            Notification.success({ message: '<i class="glyphicon glyphicon-ok"></i> Color deleted successfully!' });
          });
        } else {
          $window.swal('Cancelled', 'Your Color is safe :)', 'error');
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
        Notification.error({ message: '<i class="glyphicon glyphicon-remove"></i> Please select atleast one Color.' });
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
            $state.go('admin.colors.list', { }, { reload: true });
            Notification.success({ message: '<i class="glyphicon glyphicon-ok"></i> Color deleted successfully!' });
          } else {
            $window.swal('Cancelled', 'Your Color is safe :)', 'error');
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
        Notification.error({ message: '<i class="glyphicon glyphicon-remove"></i> Please select atleast one Color.' });
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
            Notification.success({ message: '<i class="glyphicon glyphicon-ok"></i> Color update successfully!' });
          } else {
            $window.swal('Cancelled', 'Your Color is safe :)', 'error');
          }
        });
      }
    }

    function updateStatus(color, status) {
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
          color.status = status;
          color.$update();
          Notification.success({ message: '<i class="glyphicon glyphicon-ok"></i> Color update successfully!' });
        } else {
          $window.swal('Cancelled', 'Your Color is safe :)', 'error');
        }
      });
    }
  }
}());
