(function () {
  'use strict';

  angular
    .module('advertisements.services')
    .factory('AdvertisementsService', AdvertisementsService);

  AdvertisementsService.$inject = ['$resource', '$log'];

  function AdvertisementsService($resource, $log) {
    var Advertisement = $resource('/api/advertisements/:advertisementId', {
      advertisementId: '@_id'
    }, {
      update: {
        method: 'PUT'
      }
    });

    angular.extend(Advertisement.prototype, {
      createOrUpdate: function () {
        var advertisement = this;
        return createOrUpdate(advertisement);
      }
    });

    return Advertisement;

    function createOrUpdate(advertisement) {
      if (advertisement._id) {
        return advertisement.$update(onSuccess, onError);
      } else {
        return advertisement.$save(onSuccess, onError);
      }

      // Handle successful response
      function onSuccess(advertisement) {
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
