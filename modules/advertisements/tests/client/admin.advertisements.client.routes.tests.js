(function () {
  'use strict';

  describe('Advertisements Route Tests', function () {
    // Initialize global variables
    var $scope,
      AdvertisementsService;

    // We can start by loading the main application module
    beforeEach(module(ApplicationConfiguration.applicationModuleName));

    // The injector ignores leading and trailing underscores here (i.e. _$httpBackend_).
    // This allows us to inject a service but then attach it to a variable
    // with the same name as the service.
    beforeEach(inject(function ($rootScope, _AdvertisementsService_) {
      // Set a new global scope
      $scope = $rootScope.$new();
      AdvertisementsService = _AdvertisementsService_;
    }));

    describe('Route Config', function () {
      describe('Main Route', function () {
        var mainstate;
        beforeEach(inject(function ($state) {
          mainstate = $state.get('admin.advertisements');
        }));

        it('Should have the correct URL', function () {
          expect(mainstate.url).toEqual('/advertisements');
        });

        it('Should be abstract', function () {
          expect(mainstate.abstract).toBe(true);
        });

        it('Should have template', function () {
          expect(mainstate.template).toBe('<ui-view/>');
        });
      });

      describe('List Route', function () {
        var liststate;
        beforeEach(inject(function ($state) {
          liststate = $state.get('admin.advertisements.list');
        }));

        it('Should have the correct URL', function () {
          expect(liststate.url).toEqual('');
        });

        it('Should be not abstract', function () {
          expect(liststate.abstract).toBe(undefined);
        });

        it('Should have templateUrl', function () {
          expect(liststate.templateUrl).toBe('/modules/advertisements/client/views/admin/list-advertisements.client.view.html');
        });
      });

      describe('Create Route', function () {
        var createstate,
          AdvertisementsAdminController,
          mockAdvertisement;

        beforeEach(inject(function ($controller, $state, $templateCache) {
          createstate = $state.get('admin.advertisements.create');
          $templateCache.put('/modules/advertisements/client/views/admin/form-advertisement.client.view.html', '');

          // Create mock advertisement
          mockAdvertisement = new AdvertisementsService();

          // Initialize Controller
          AdvertisementsAdminController = $controller('AdvertisementsAdminController as vm', {
            $scope: $scope,
            advertisementResolve: mockAdvertisement
          });
        }));

        it('Should have the correct URL', function () {
          expect(createstate.url).toEqual('/create');
        });

        it('Should have a resolve function', function () {
          expect(typeof createstate.resolve).toEqual('object');
          expect(typeof createstate.resolve.advertisementResolve).toEqual('function');
        });

        it('should respond to URL', inject(function ($state) {
          expect($state.href(createstate)).toEqual('/admin/advertisements/create');
        }));

        it('should attach an advertisement to the controller scope', function () {
          expect($scope.vm.advertisement._id).toBe(mockAdvertisement._id);
          expect($scope.vm.advertisement._id).toBe(undefined);
        });

        it('Should not be abstract', function () {
          expect(createstate.abstract).toBe(undefined);
        });

        it('Should have templateUrl', function () {
          expect(createstate.templateUrl).toBe('/modules/advertisements/client/views/admin/form-advertisement.client.view.html');
        });
      });

      describe('Edit Route', function () {
        var editstate,
          AdvertisementsAdminController,
          mockAdvertisement;

        beforeEach(inject(function ($controller, $state, $templateCache) {
          editstate = $state.get('admin.advertisements.edit');
          $templateCache.put('/modules/advertisements/client/views/admin/form-advertisement.client.view.html', '');

          // Create mock advertisement
          mockAdvertisement = new AdvertisementsService({
            _id: '525a8422f6d0f87f0e407a33',
            title: 'An Advertisement about MEAN',
            content: 'MEAN rocks!'
          });

          // Initialize Controller
          AdvertisementsAdminController = $controller('AdvertisementsAdminController as vm', {
            $scope: $scope,
            advertisementResolve: mockAdvertisement
          });
        }));

        it('Should have the correct URL', function () {
          expect(editstate.url).toEqual('/:advertisementId/edit');
        });

        it('Should have a resolve function', function () {
          expect(typeof editstate.resolve).toEqual('object');
          expect(typeof editstate.resolve.advertisementResolve).toEqual('function');
        });

        it('should respond to URL', inject(function ($state) {
          expect($state.href(editstate, {
            advertisementId: 1
          })).toEqual('/admin/advertisements/1/edit');
        }));

        it('should attach an advertisement to the controller scope', function () {
          expect($scope.vm.advertisement._id).toBe(mockAdvertisement._id);
        });

        it('Should not be abstract', function () {
          expect(editstate.abstract).toBe(undefined);
        });

        it('Should have templateUrl', function () {
          expect(editstate.templateUrl).toBe('/modules/advertisements/client/views/admin/form-advertisement.client.view.html');
        });

        xit('Should go to unauthorized route', function () {

        });
      });

    });
  });
}());
