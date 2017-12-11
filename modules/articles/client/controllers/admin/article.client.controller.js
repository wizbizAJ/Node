(function () {
  'use strict';

  angular
    .module('articles.admin')
    .controller('ArticlesAdminController', ArticlesAdminController);

  ArticlesAdminController.$inject = ['$scope', '$state', '$window', 'articleResolve', 'Authentication', 'Notification', '$location', 'Lookup_categorysService'];

  function ArticlesAdminController($scope, $state, $window, article, Authentication, Notification, $location, Lookup_categorysService) {
    var vm = this;

    vm.article = article;
    vm.authentication = Authentication;
    vm.form = {};
    vm.remove = remove;
    vm.save = save;
    if (!vm.authentication.user) {
      $location.path('/authentication/signin');
    }
    if (!vm.article.status) {
      vm.article.status = 'Active';
    }

    Lookup_categorysService.query({ 'status': 'Active' }, function (data) {
      vm.lookupCategoryList = data;
    });

    // Remove existing Article
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
          vm.article.$remove(function() {
            $state.go('admin.articles.list');
            Notification.success({ message: '<i class="glyphicon glyphicon-ok"></i> Article deleted successfully!' });
          });
        } else {
          $window.swal('Cancelled', 'Your Article is safe :)', 'error');
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

    // Save Article
    function save(isValid) {
      if (!isValid) {
        $scope.$broadcast('show-errors-check-validity', 'vm.form.articleForm');
        return false;
      }

      // Create a new article, or update the current instance
      vm.article.createOrUpdate()
        .then(successCallback)
        .catch(errorCallback);

      function successCallback(res) {
        $state.go('admin.articles.list'); // should we send the User to the list or the updated Article's view?
        Notification.success({ message: '<i class="glyphicon glyphicon-ok"></i> Article saved successfully!' });
      }

      function errorCallback(res) {
        Notification.error({ message: res.data.message, title: '<i class="glyphicon glyphicon-remove"></i> Article save error!' });
      }
    }
  }
}());
