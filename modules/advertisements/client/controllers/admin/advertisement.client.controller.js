(function () {
  'use strict';

  angular
    .module('advertisements.admin')
    .controller('AdvertisementsAdminController', AdvertisementsAdminController);

  AdvertisementsAdminController.$inject = ['$scope', '$state', '$window', 'advertisementResolve', 'Authentication', 'Notification', 'ProductsService', 'StyleLooksService', '$location', 'Upload', '$http', 'Campaign_categorysService', 'Campaign_companysService'];

  function AdvertisementsAdminController($scope, $state, $window, advertisement, Authentication, Notification, ProductsService, StyleLooksService, $location, Upload, $http, Campaign_categorysService, Campaign_companysService) {
    var vm = this;

    vm.advertisement = advertisement;
    vm.authentication = Authentication;
    vm.form = {};
    vm.remove = remove;
    vm.save = save;
    vm.save1 = save1;
    vm.removeMedia = removeMedia;
    vm.getFiles = getFiles;
    vm.updatePrimary = updatePrimary;
    vm.getAdvertisementImage = getAdvertisementImage;
    vm.hstep = 1;
    vm.mstep = 5;
    if (!vm.authentication.user) {
      $location.path('/authentication/signin');
    }

    if (!vm.advertisement.status) {
      vm.advertisement.status = 'Active';
    }
    var socket = io();

    socket.on('welcome', function(data) {
      vm.data = 'pmmmmmmm';
    });
    vm.uploadProfile = function (dataUrl, pathStr) {
      Upload.upload({
        url: '/api/products/media',
        arrayKey: '',
        data: {
          newProfilePicture: dataUrl
        },
        params: {
          path: pathStr
        }
      }).then(function (response) {
        getFiles(pathStr);
      });
    };

    function removeMedia(advertisement, mymedia) {
      var myMedia = [];
      angular.forEach(advertisement.mediaSelector, function (item) {
        if (item !== mymedia) {
          myMedia.push(item);
        }
      });

      if (mymedia === advertisement.primaryMedia) {
        advertisement.primaryMedia = '';
      }
      advertisement.mediaSelector = myMedia;
      Notification.success({ message: '<i class="glyphicon glyphicon-ok"></i> Image remove successfully!' });
    }
    function save1(isValid) {
      if (!isValid) {
        $scope.$broadcast('show-errors-check-validity', 'vm.form.advertisementForm');
        return false;
      }
      var oldMedia = [];
      var mediaImg;
      for (mediaImg in vm.advertisement.mediaSelector) {
        if (vm.advertisement.mediaSelector[mediaImg]) {
          oldMedia.push(vm.advertisement.mediaSelector[mediaImg]);
        }
      }
      vm.advertisement.mediaSelector = oldMedia;
      $('.bs-example-modal-lg').modal('toggle');
      $('.bs-example-modal-right').modal('show');
    }
    function getAdvertisementImage(advertisement) {
      vm.advertisement = advertisement;
    }

    function getFiles(path) {
      $http({
        method: 'GET',
        url: 'http://localhost/AUM/public/getFileList.php?path=' + path
      }).then(function successCallback(response) {
        vm.getFileLists = response.data;
      }, function errorCallback(response) {
        console.log(response);
      });
    }
    function updatePrimary(advertisement, mymedia) {
      advertisement.primaryMedia = mymedia;
      Notification.success({ message: '<i class="glyphicon glyphicon-ok"></i> Advertisement Image updated successfully!' });
    }
    Campaign_companysService.query({ 'status': 'Active' }, function (data) {
      vm.campiagnComlanyList = data;
    });
    
    ProductsService.query({ 'status': 'Active' }, function (data) {
      vm.productList = data;
    });
    
    vm.forType = forType;
    function forType (campaignCompany) {
        
        vm.advertisement.type = '';
        
        Campaign_companysService.query({ 'status': 'Active', '_id':campaignCompany }, function (data) {
        vm.campaigncompanyList = data;
        
          vm.counter = 0;
          vm.campaign_categoryList = [];
          if ( vm.campaigncompanyList[0].livecodelookup.length > 0) {
              
             angular.forEach(vm.campaigncompanyList[0].livecodelookup, function (value, key) {
                 
                 angular.forEach(value.campaingCategoryId, function (codeCc, codeCcItemKey111) {
                 
                 Campaign_categorysService.query({ 'status': 'Active', _id: codeCc }, function (dataCcData) {
                    angular.forEach(dataCcData, function (codeItem1, codeItemKey1) {
                        var myError = 0;
                        angular.forEach(vm.campaign_categoryList, function(uniqueItem1, uniqueKey1){
                          if(uniqueItem1._id === codeItem1._id) {
                            myError = 1;
                          }
                        });

                        if(myError === 0) {
                          vm.campaign_categoryList.push(codeItem1);
                        }
                      });
                 });
                 
                 });
             }); 
          }
           
      });
    }
     
     
     
     if (vm.advertisement.campaign_company) {
         
         
         Campaign_companysService.query({ 'status': 'Active', '_id':vm.advertisement.campaign_company._id }, function (data) {
         vm.campaigncompanyList = data;
        
          vm.counter = 0;
          vm.campaign_categoryList = [];
          if ( vm.campaigncompanyList[0].livecodelookup.length > 0) {
              
             angular.forEach(vm.campaigncompanyList[0].livecodelookup, function (value, key) {
                 
                 angular.forEach(value.campaingCategoryId, function (codeCc, codeCcItemKey111) {
                 
                 Campaign_categorysService.query({ 'status': 'Active', _id: codeCc }, function (dataCcData) {
                    angular.forEach(dataCcData, function (codeItem1, codeItemKey1) {
                        var myError = 0;
                        angular.forEach(vm.campaign_categoryList, function(uniqueItem1, uniqueKey1){
                          if(uniqueItem1._id === codeItem1._id) {
                            myError = 1;
                          }
                        });

                        if(myError === 0) {
                          vm.campaign_categoryList.push(codeItem1);
                        }
                      });
                 });
                 
                 });
             }); 
          }
           
      });
         
     }
    
    
//    Campaign_categorysService.query({ 'status': 'Active' }, function (data) {
//      vm.campaign_categoryList = data;
//    });
    StyleLooksService.query({ 'status': 'Active' }, function (data) {
      vm.styleLookList = data;
    });
    // Remove existing Advertisement
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
          vm.advertisement.$remove(function() {
            $state.go('admin.advertisements.list');
            Notification.success({ message: '<i class="glyphicon glyphicon-ok"></i> Advertisement deleted successfully!' });
          });
        } else {
          $window.swal('Cancelled', 'Your Advertisement is safe :)', 'error');
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

    // Save Advertisement
    function save(isValid) {
      if (!isValid) {
        $scope.$broadcast('show-errors-check-validity', 'vm.form.advertisementForm');
        return false;
      }

      // Create a new advertisement, or update the current instance
      vm.advertisement.createOrUpdate()
        .then(successCallback)
        .catch(errorCallback);

      function successCallback(res) {
        $state.go('admin.advertisements.list'); // should we send the User to the list or the updated Advertisement's view?
        Notification.success({ message: '<i class="glyphicon glyphicon-ok"></i> Advertisement saved successfully!' });
      }

      function errorCallback(res) {
        Notification.error({ message: res.data.message, title: '<i class="glyphicon glyphicon-remove"></i> Advertisement save error!' });
      }
    }
  }
}());
