(function () {
  'use strict';

  angular
    .module('campaign_types.admin')
    .controller('Campaign_typesAdminController', Campaign_typesAdminController);

  Campaign_typesAdminController.$inject = ['$scope', '$state', '$window', 'campaign_typeResolve', 'Authentication', 'Notification', '$location', 'Product_Communication_ChannelsService', 'ProductLinesService'];

  function Campaign_typesAdminController($scope, $state, $window, campaign_type, Authentication, Notification, $location, Product_Communication_ChannelsService, ProductLinesService) {
    var vm = this;

    vm.campaign_type = campaign_type;
    vm.authentication = Authentication;
    vm.form = {};
    vm.remove = remove;
    vm.save = save;
    if (!vm.authentication.user) {
      $location.path('/authentication/signin');
    }
    if (!vm.campaign_type.status) {
      vm.campaign_type.status = 'Active';
    }
    if (vm.campaign_type.productLineOption) {
        var tmp = [];
        for (var key in vm.campaign_type.productLineOption) {
            tmp[key] = vm.campaign_type.productLineOption[key]._id;
        }
          vm.campaign_type.productLineOption = tmp;
    }
    Product_Communication_ChannelsService.query({ 'status': 'Active' }, function (data) {
      vm.channeProductlList = data;
    });

    ProductLinesService.query({ 'status': 'Active' }, function (data) {
      vm.productLineList = data;
    });

    // Remove existing Campaign_type
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
          vm.campaign_type.$remove(function() {
            $state.go('admin.campaign_types.list');
            Notification.success({ message: '<i class="glyphicon glyphicon-ok"></i> Character CTA deleted successfully!' });
          });
        } else {
          $window.swal('Cancelled', 'Your Character CTA is safe :)', 'error');
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

    // Save Campaign_type
    function save(isValid) {
      if (!isValid) {
        $scope.$broadcast('show-errors-check-validity', 'vm.form.campaign_typeForm');
        return false;
      }

      // Create a new campaign_type, or update the current instance
      vm.campaign_type.createOrUpdate()
        .then(successCallback)
        .catch(errorCallback);

      function successCallback(res) {
        $state.go('admin.campaign_types.list'); // should we send the User to the list or the updated Campaign_type's view?
        Notification.success({ message: '<i class="glyphicon glyphicon-ok"></i> Character CTA saved successfully!' });
      }

      function errorCallback(res) {
        Notification.error({ message: res.data.message, title: '<i class="glyphicon glyphicon-remove"></i> Character CTA save error!' });
      }
    }
  }
}());
