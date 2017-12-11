(function () {
  'use strict';

  angular
    .module('departments.admin')
    .controller('DepartmentsAdminListController', DepartmentsAdminListController);

  DepartmentsAdminListController.$inject = ['$scope', '$state', '$window', '$filter', 'Authentication', 'DepartmentsService', 'Notification', '$http', '$location'];

  function DepartmentsAdminListController($scope, $state, $window, $filter, Authentication, DepartmentsService, Notification, $http, $location) {
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
    vm.updateDefaultDepartment = updateDefaultDepartment;
    vm.begin = 0;
    vm.end = 0;
    vm.itemsPerPage = '25';
    vm.itemsPerPageSelection = '25';
    vm.changePerPage = changePerPage;

    // vm.departments = DepartmentsService.query();
    if (!vm.authentication.user) {
      $location.path('/authentication/signin');
    }
    DepartmentsService.query({ status: { $ne: 'Deleted' } }, function (data) {
      vm.departments = data;
      angular.forEach(vm.departments, function (item, key) {
        vm.date1 = new Date(vm.departments[key].updated);
        vm.getDate = (vm.date1.getDate().toString().length <= 1) ? '0' + vm.date1.getDate() : vm.date1.getDate();
        vm.getMonth = ((vm.date1.getMonth() + 1).toString().length <= 1) ? '0' + (vm.date1.getMonth() + 1) : (vm.date1.getMonth() + 1);
        vm.departments[key].updatedFilter = vm.getDate + '-' + vm.getMonth + '-' + vm.date1.getFullYear();
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
      vm.filteredItems = $filter('filter')(vm.departments, {
        name: vm.name,
        contactName: vm.contactName,
        contactNumber: vm.contactNumber,
        code: vm.code,
        // user: vm.user,
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

    function remove(department) {
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
          department.$remove(function() {
            $state.go('admin.departments.list', { }, { reload: true });
            Notification.success({ message: '<i class="glyphicon glyphicon-ok"></i> Department deleted successfully!' });
          });
        } else {
          $window.swal('Cancelled', 'Your Department is safe :)', 'error');
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
        Notification.error({ message: '<i class="glyphicon glyphicon-remove"></i> Please select atleast one Department.' });
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
            $state.go('admin.departments.list', { }, { reload: true });
            Notification.success({ message: '<i class="glyphicon glyphicon-ok"></i> Department deleted successfully!' });
          } else {
            $window.swal('Cancelled', 'Your Department is safe :)', 'error');
          }
        });
      }
    }

    function updateDefaultDepartment() {
      var error = 0;
      var count = 0;
      angular.forEach(vm.pagedItems, function (item) {
        if (item.Selected) {
          error = 1;
          count = count + 1;
        }
      });
      if (error === 0) {
        Notification.error({ message: '<i class="glyphicon glyphicon-remove"></i> Please select atleast one Department.' });
      } else if (count > 1) {
        Notification.error({ message: '<i class="glyphicon glyphicon-remove"></i> Please select only one Department.' });
      } else {
        $window.swal({
          title: 'Are you sure?',
          text: 'Yes, it is default character Type.',
          type: 'warning',
          showCancelButton: true,
          confirmButtonColor: '#DD6B55',
          confirmButtonText: 'Yes, default character Type!',
          cancelButtonText: 'No, cancel plx!',
          closeOnConfirm: true,
          closeOnCancel: false
        }, function(isConfirm) {
          if (isConfirm) {
            angular.forEach(vm.pagedItems, function (item) {
              if (item.Selected && item.default === 'No') {
                DepartmentsService.query({ 'default': 'Yes' }, function (data) {
                  angular.forEach(data, function(item1) {
                    item1.default = 'No';
                    item1.$update();
                  });
                  DepartmentsService.query(function (data) {
                    vm.departments = data;
                    vm.buildPager();
                  });
                });
                item.default = 'Yes';
                item.$update();
              }
            });

            // $state.go('admin.departments.list', { }, { reload: true });
            Notification.success({ message: '<i class="glyphicon glyphicon-ok"></i> Department updated successfully!' });
          } else {
            $window.swal('Cancelled', 'Your Department is safe :)', 'error');
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
        Notification.error({ message: '<i class="glyphicon glyphicon-remove"></i> Please select atleast one Department.' });
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
            Notification.success({ message: '<i class="glyphicon glyphicon-ok"></i> Department update successfully!' });
          } else {
            $window.swal('Cancelled', 'Your Department is safe :)', 'error');
          }
        });
      }
    }

    function updateStatus(department, status) {
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
          department.status = status;
          department.$update();
          Notification.success({ message: '<i class="glyphicon glyphicon-ok"></i> Department update successfully!' });
        } else {
          $window.swal('Cancelled', 'Your Department is safe :)', 'error');
        }
      });
    }
  }
}());
