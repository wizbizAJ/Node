(function () {
  'use strict';

  angular
    .module('colors.services')
    .factory('ColorsService', ColorsService);

  ColorsService.$inject = ['$resource', '$log'];

  function ColorsService($resource, $log) {
    var Color = $resource('/api/colors/:colorId', {
      colorId: '@_id'
    }, {
      update: {
        method: 'PUT'
      }
    });

    angular.extend(Color.prototype, {
      createOrUpdate: function () {
        var color = this;
        return createOrUpdate(color);
      }
    });

    return Color;

    function createOrUpdate(color) {
      if (color._id) {
        return color.$update(onSuccess, onError);
      } else {
        return color.$save(onSuccess, onError);
      }

      // Handle successful response
      function onSuccess(color) {
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
