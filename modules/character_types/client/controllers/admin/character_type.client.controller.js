(function () {
  'use strict';

  angular
    .module('character_types.admin')
    .controller('Character_typesAdminController', Character_typesAdminController);

  Character_typesAdminController.$inject = ['$scope', '$state', '$window', 'character_typeResolve', 'Authentication', 'Notification', '$location'];

  function Character_typesAdminController($scope, $state, $window, character_type, Authentication, Notification, $location) {
    var vm = this;

    vm.character_type = character_type;
    vm.authentication = Authentication;
    vm.form = {};
    vm.remove = remove;
    vm.save = save;
    if (!vm.authentication.user) {
      $location.path('/authentication/signin');
    }
    if (!vm.character_type.status) {
      vm.character_type.status = 'Active';
    }

    // Remove existing Character_type
    function remove() {
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
          vm.character_type.$remove(function() {
            $state.go('admin.character_types.list');
            Notification.success({ message: '<i class="glyphicon glyphicon-ok"></i> Celebrity Type deleted successfully!' });
          });
        } else {
          $window.swal('Cancelled', 'Your Celebrity Type is safe :)', 'error');
        }
      });
    }

// Configure tinymce options
    $scope.tinymceOptions = {
      selector: 'textarea',
      inline: false,
      skin: 'lightgray',
      theme: 'modern',
      plugins: ['advlist autolink link image lists charmap print preview hr anchor pagebreak spellchecker', 'searchreplace wordcount visualblocks visualchars code fullscreen insertdatetime media nonbreaking', 'save table contextmenu directionality emoticons template paste textcolor'],
      menubar: 'edit insert view format',
      toolbar: ['undo redo cut copy paste | link image | print preview fullscreen', 'alignleft aligncenter alignright alignjustify | bullist numlist outdent indent | forecolor backcolor | formatselect fontselect fontsizeselect'],
      file_picker_callback: function(callback, value, meta) {
        if (meta.filetype === 'image') {
          $('#upload').trigger('click');
          $('#upload').on('change', function() {
            var file = this.files[0];
            var reader = new FileReader();
            reader.onload = function(e) {
              callback(e.target.result, {
                alt: ''
              });
            };
            reader.readAsDataURL(file);
          });
        }
      }
    };

    // Save Character_type
    function save(isValid) {
      if (!isValid) {
        $scope.$broadcast('show-errors-check-validity', 'vm.form.character_typeForm');
        return false;
      }

      // Create a new character_type, or update the current instance
      vm.character_type.createOrUpdate()
        .then(successCallback)
        .catch(errorCallback);

      function successCallback(res) {
        $state.go('admin.character_types.list'); // should we send the User to the list or the updated Character_type's view?
        Notification.success({ message: '<i class="glyphicon glyphicon-ok"></i> Celebrity Type saved successfully!' });
      }

      function errorCallback(res) {
        Notification.error({ message: res.data.message, title: '<i class="glyphicon glyphicon-remove"></i> Celebrity Type save error!' });
      }
    }
  }
}());
