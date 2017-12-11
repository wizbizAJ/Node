(function () {
  'use strict';

  angular
    .module('campaign_types.admin')
    .controller('Campaign_typesAdminListController', Campaign_typesAdminListController);

  Campaign_typesAdminListController.$inject = ['$scope', '$state', '$window', '$filter', 'Authentication', 'Campaign_typesService', 'Notification', '$http', '$location'];

  function Campaign_typesAdminListController($scope, $state, $window, $filter, Authentication, Campaign_typesService, Notification, $http, $location) {
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
    vm.updateDefaultCampaign_type = updateDefaultCampaign_type;
    vm.begin = 0;
    vm.end = 0;
    vm.itemsPerPage = '25';
    vm.itemsPerPageSelection = '25';
    vm.changePerPage = changePerPage;

    // vm.campaign_types = Campaign_typesService.query();
    if (!vm.authentication.user) {
      $location.path('/authentication/signin');
    }
    Campaign_typesService.query({ status: { $ne: 'Deleted' } }, function (data) {
      vm.campaign_types = data;
      angular.forEach(vm.campaign_types, function (item, key) {
        vm.date1 = new Date(vm.campaign_types[key].updated);
        vm.getDate = (vm.date1.getDate().toString().length <= 1) ? '0' + vm.date1.getDate() : vm.date1.getDate();
        vm.getMonth = ((vm.date1.getMonth() + 1).toString().length <= 1) ? '0' + (vm.date1.getMonth() + 1) : (vm.date1.getMonth() + 1);
        vm.campaign_types[key].updatedFilter = vm.getDate + '-' + vm.getMonth + '-' + vm.date1.getFullYear();
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
      vm.filteredItems = $filter('filter')(vm.campaign_types, {
        name: vm.name,
        code: vm.code,
        productLineOption: vm.productLineOption,
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

    function remove(campaign_type) {
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
          campaign_type.$remove(function() {
            $state.go('admin.campaign_types.list', { }, { reload: true });
            Notification.success({ message: '<i class="glyphicon glyphicon-ok"></i> Campaign CTA deleted successfully!' });
          });
        } else {
          $window.swal('Cancelled', 'Your Campaign CTA is safe :)', 'error');
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
        Notification.error({ message: '<i class="glyphicon glyphicon-remove"></i> Please select atleast one Campaign CTA.' });
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
            $state.go('admin.campaign_types.list', { }, { reload: true });
            Notification.success({ message: '<i class="glyphicon glyphicon-ok"></i> Campaign CTA deleted successfully!' });
          } else {
            $window.swal('Cancelled', 'Your Campaign CTA is safe :)', 'error');
          }
        });
      }
    }

    function updateDefaultCampaign_type() {
      var error = 0;
      var count = 0;
      angular.forEach(vm.pagedItems, function (item) {
        if (item.Selected) {
          error = 1;
          count = count + 1;
        }
      });
      if (error === 0) {
        Notification.error({ message: '<i class="glyphicon glyphicon-remove"></i> Please select atleast one Campaign CTA.' });
      } else if (count > 1) {
        Notification.error({ message: '<i class="glyphicon glyphicon-remove"></i> Please select only one Campaign CTA.' });
      } else {
        $window.swal({
          title: 'Are you sure?',
          text: 'Yes, it is default Campaign CTA.',
          type: 'warning',
          showCancelButton: true,
          confirmButtonColor: '#DD6B55',
          confirmButtonText: 'Yes, default Campaign CTA!',
          cancelButtonText: 'No, cancel plx!',
          closeOnConfirm: true,
          closeOnCancel: false
        }, function(isConfirm) {
          if (isConfirm) {
            angular.forEach(vm.pagedItems, function (item) {
              if (item.Selected && item.default === 'No') {
                Campaign_typesService.query({ 'default': 'Yes' }, function (data) {
                  angular.forEach(data, function(item1) {
                    item1.default = 'No';
                    item1.$update();
                  });
                  Campaign_typesService.query(function (data) {
                    vm.campaign_types = data;
                    vm.buildPager();
                  });
                });
                item.default = 'Yes';
                item.$update();
              }
            });

            // $state.go('admin.campaign_types.list', { }, { reload: true });
            Notification.success({ message: '<i class="glyphicon glyphicon-ok"></i> Campaign CTA updated successfully!' });
          } else {
            $window.swal('Cancelled', 'Your Campaign CTA is safe :)', 'error');
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
        Notification.error({ message: '<i class="glyphicon glyphicon-remove"></i> Please select atleast one Campaign CTA.' });
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
            Notification.success({ message: '<i class="glyphicon glyphicon-ok"></i> Campaign CTA update successfully!' });
          } else {
            $window.swal('Cancelled', 'Your Campaign Type is safe :)', 'error');
          }
        });
      }
    }

    function updateStatus(campaign_type, status) {
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
          campaign_type.status = status;
          campaign_type.$update();
          Notification.success({ message: '<i class="glyphicon glyphicon-ok"></i> Campaign CTA update successfully!' });
        } else {
          $window.swal('Cancelled', 'Your Campaign CTA is safe :)', 'error');
        }
      });
    }
  }
}());
