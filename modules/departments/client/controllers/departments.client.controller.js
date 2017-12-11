(function () {
  'use strict';

  angular
    .module('departments')
    .controller('DepartmentsController', DepartmentsController);

  DepartmentsController.$inject = ['$scope', 'departmentResolve', 'Authentication'];

  function DepartmentsController($scope, department, Authentication) {
    var vm = this;

    vm.department = department;
    vm.authentication = Authentication;

  }
}());
