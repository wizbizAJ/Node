(function () {
  'use strict';

  angular
    .module('departments.services')
    .factory('DepartmentsService', DepartmentsService);

  DepartmentsService.$inject = ['$resource', '$log'];

  function DepartmentsService($resource, $log) {
    var Department = $resource('/api/departments/:departmentId', {
      departmentId: '@_id'
    }, {
      update: {
        method: 'PUT'
      }
    });

    angular.extend(Department.prototype, {
      createOrUpdate: function () {
        var department = this;
        return createOrUpdate(department);
      }
    });

    return Department;

    function createOrUpdate(department) {
      if (department._id) {
        return department.$update(onSuccess, onError);
      } else {
        return department.$save(onSuccess, onError);
      }

      // Handle successful response
      function onSuccess(department) {
        // Any required internal processing from inside the service, goes here.
      }

      // Handle error response
      function onError(errorResponse) {
        var error = errorResponse.data;
        // Handle error internally
        handleError(error);
      }
    }

    function handleError(error) {
      // Log error
      $log.error(error);
    }
  }
}());
