(function () {
  'use strict';

  angular
    .module('colors.admin')
    .controller('ColorsAdminController', ColorsAdminController);

  ColorsAdminController.$inject = ['$scope', '$state', '$window', 'colorResolve', 'Authentication', 'Notification', '$location'];

  function ColorsAdminController($scope, $state, $window, color, Authentication, Notification, $location) {
    var vm = this;

    vm.color = color;
    vm.authentication = Authentication;
    vm.form = {};
    vm.remove = remove;
    vm.hexa = hexa;
    vm.save = save;
    if (!vm.authentication.user) {
      $location.path('/authentication/signin');
    }
    if (!vm.color.status) {
      vm.color.status = 'Active';
    }

    // Remove existing Color
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
          vm.color.$remove(function() {
            $state.go('admin.colors.list');
            Notification.success({ message: '<i class="glyphicon glyphicon-ok"></i> Color deleted successfully!' });
          });
        } else {
          $window.swal('Cancelled', 'Your Color is safe :)', 'error');
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

    // Save Color
    function save(isValid) {
      if (!isValid) {
        $scope.$broadcast('show-errors-check-validity', 'vm.form.colorForm');
        return false;
      }

      // Create a new color, or update the current instance
      vm.color.createOrUpdate()
        .then(successCallback)
        .catch(errorCallback);

      function successCallback(res) {
        $state.go('admin.colors.list'); // should we send the User to the list or the updated Color's view?
        Notification.success({ message: '<i class="glyphicon glyphicon-ok"></i> Color saved successfully!' });
      }

      function errorCallback(res) {
        Notification.error({ message: res.data.message, title: '<i class="glyphicon glyphicon-remove"></i> Color save error!' });
      }
    }
    function hexa(hex) {
      hex = hex.replace(/[^0-9A-F]/gi, '');
      var bigint = parseInt(hex, 16);
      var r = (bigint >> 16) & 255;
      var g = (bigint >> 8) & 255;
      var b = bigint & 255;
      vm.color.rgbcode = 'rgb(' + [r, g, b].join() + ')';
    }
  }
}());
