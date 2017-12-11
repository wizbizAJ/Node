(function () {
  'use strict';

  angular
    .module('departments.admin')
    .controller('DepartmentsAdminController', DepartmentsAdminController);

  DepartmentsAdminController.$inject = ['$scope', '$state', '$window', 'departmentResolve', 'Authentication', 'Notification', '$location', 'UsersService'];

  function DepartmentsAdminController($scope, $state, $window, department, Authentication, Notification, $location, UsersService) {
    var vm = this;

    vm.department = department;
    vm.authentication = Authentication;
    vm.form = {};
    vm.remove = remove;
    vm.save = save;
    if (!vm.authentication.user) {
      $location.path('/authentication/signin');
    }
    if (!vm.department.status) {
      vm.department.status = 'Active';
    }
    UsersService.query({}, function (data) {
      vm.userList = data;
    });
    // Remove existing Department
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
          vm.department.$remove(function() {
            $state.go('admin.departments.list');
            Notification.success({ message: '<i class="glyphicon glyphicon-ok"></i> Department deleted successfully!' });
          });
        } else {
          $window.swal('Cancelled', 'Your Department is safe :)', 'error');
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

    // Save Department
    function save(isValid) {
      if (!isValid) {
        $scope.$broadcast('show-errors-check-validity', 'vm.form.departmentForm');
        return false;
      }

      // Create a new department, or update the current instance
      vm.department.createOrUpdate()
        .then(successCallback)
        .catch(errorCallback);

      function successCallback(res) {
        $state.go('admin.departments.list'); // should we send the User to the list or the updated Department's view?
        Notification.success({ message: '<i class="glyphicon glyphicon-ok"></i> Department saved successfully!' });
      }

      function errorCallback(res) {
        Notification.error({ message: res.data.message, title: '<i class="glyphicon glyphicon-remove"></i> Department save error!' });
      }
    }
  }
}());
