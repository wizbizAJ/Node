(function () {
  'use strict';

  angular
    .module('character_types.services')
    .factory('Character_typesService', Character_typesService);

  Character_typesService.$inject = ['$resource', '$log'];

  function Character_typesService($resource, $log) {
    var Character_type = $resource('/api/character_types/:character_typeId', {
      character_typeId: '@_id'
    }, {
      update: {
        method: 'PUT'
      }
    });

    angular.extend(Character_type.prototype, {
      createOrUpdate: function () {
        var character_type = this;
        return createOrUpdate(character_type);
      }
    });

    return Character_type;

    function createOrUpdate(character_type) {
      if (character_type._id) {
        return character_type.$update(onSuccess, onError);
      } else {
        return character_type.$save(onSuccess, onError);
      }

      // Handle successful response
      function onSuccess(character_type) {
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
