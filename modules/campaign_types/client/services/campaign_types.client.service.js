(function () {
  'use strict';

  angular
    .module('campaign_types.services')
    .factory('Campaign_typesService', Campaign_typesService);

  Campaign_typesService.$inject = ['$resource', '$log'];

  function Campaign_typesService($resource, $log) {
    var Campaign_type = $resource('/api/campaign_types/:campaign_typeId', {
      campaign_typeId: '@_id'
    }, {
      update: {
        method: 'PUT'
      }
    });

    angular.extend(Campaign_type.prototype, {
      createOrUpdate: function () {
        var campaign_type = this;
        return createOrUpdate(campaign_type);
      }
    });

    return Campaign_type;

    function createOrUpdate(campaign_type) {
      if (campaign_type._id) {
        return campaign_type.$update(onSuccess, onError);
      } else {
        return campaign_type.$save(onSuccess, onError);
      }

      // Handle successful response
      function onSuccess(campaign_type) {
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
