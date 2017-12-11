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
          mainstate = $state.get('advertisements');
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
          liststate = $state.get('advertisements.list');
        }));

        it('Should have the correct URL', function () {
          expect(liststate.url).toEqual('');
        });

        it('Should not be abstract', function () {
          expect(liststate.abstract).toBe(undefined);
        });

        it('Should have templateUrl', function () {
          expect(liststate.templateUrl).toBe('/modules/advertisements/client/views/list-advertisements.client.view.html');
        });
      });

      describe('View Route', function () {
        var viewstate,
          AdvertisementsController,
          mockAdvertisement;

        beforeEach(inject(function ($controller, $state, $templateCache) {
          viewstate = $state.get('advertisements.view');
          $templateCache.put('/modules/advertisements/client/views/view-advertisement.client.view.html', '');

          // create mock advertisement
          mockAdvertisement = new AdvertisementsService({
            _id: '525a8422f6d0f87f0e407a33',
            title: 'An Advertisement about MEAN',
            content: 'MEAN rocks!'
          });

          // Initialize Controller
          AdvertisementsController = $controller('AdvertisementsController as vm', {
            $scope: $scope,
            advertisementResolve: mockAdvertisement
          });
        }));

        it('Should have the correct URL', function () {
          expect(viewstate.url).toEqual('/:advertisementId');
        });

        it('Should have a resolve function', function () {
          expect(typeof viewstate.resolve).toEqual('object');
          expect(typeof viewstate.resolve.advertisementResolve).toEqual('function');
        });

        it('should respond to URL', inject(function ($state) {
          expect($state.href(viewstate, {
            advertisementId: 1
          })).toEqual('/advertisements/1');
        }));

        it('should attach an advertisement to the controller scope', function () {
          expect($scope.vm.advertisement._id).toBe(mockAdvertisement._id);
        });

        it('Should not be abstract', function () {
          expect(viewstate.abstract).toBe(undefined);
        });

        it('Should have templateUrl', function () {
          expect(viewstate.templateUrl).toBe('/modules/advertisements/client/views/view-advertisement.client.view.html');
        });
      });

      describe('Handle Trailing Slash', function () {
        beforeEach(inject(function ($state, $rootScope, $templateCache) {
          $templateCache.put('/modules/advertisements/client/views/list-advertisements.client.view.html', '');

          $state.go('advertisements.list');
          $rootScope.$digest();
        }));

        it('Should remove trailing slash', inject(function ($state, $location, $rootScope) {
          $location.path('advertisements/');
          $rootScope.$digest();

          expect($location.path()).toBe('/advertisements');
          expect($state.current.templateUrl).toBe('/modules/advertisements/client/views/list-advertisements.client.view.html');
        }));
      });
    });
  });
}());
