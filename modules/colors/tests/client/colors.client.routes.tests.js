(function () {
  'use strict';

  describe('Colors Route Tests', function () {
    // Initialize global variables
    var $scope,
      ColorsService;

    // We can start by loading the main application module
    beforeEach(module(ApplicationConfiguration.applicationModuleName));

    // The injector ignores leading and trailing underscores here (i.e. _$httpBackend_).
    // This allows us to inject a service but then attach it to a variable
    // with the same name as the service.
    beforeEach(inject(function ($rootScope, _ColorsService_) {
      // Set a new global scope
      $scope = $rootScope.$new();
      ColorsService = _ColorsService_;
    }));

    describe('Route Config', function () {
      describe('Main Route', function () {
        var mainstate;
        beforeEach(inject(function ($state) {
          mainstate = $state.get('colors');
        }));

        it('Should have the correct URL', function () {
          expect(mainstate.url).toEqual('/colors');
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
          liststate = $state.get('colors.list');
        }));

        it('Should have the correct URL', function () {
          expect(liststate.url).toEqual('');
        });

        it('Should not be abstract', function () {
          expect(liststate.abstract).toBe(undefined);
        });

        it('Should have templateUrl', function () {
          expect(liststate.templateUrl).toBe('/modules/colors/client/views/list-colors.client.view.html');
        });
      });

      describe('View Route', function () {
        var viewstate,
          ColorsController,
          mockColor;

        beforeEach(inject(function ($controller, $state, $templateCache) {
          viewstate = $state.get('colors.view');
          $templateCache.put('/modules/colors/client/views/view-color.client.view.html', '');

          // create mock color
          mockColor = new ColorsService({
            _id: '525a8422f6d0f87f0e407a33',
            title: 'An Color about MEAN',
            content: 'MEAN rocks!'
          });

          // Initialize Controller
          ColorsController = $controller('ColorsController as vm', {
            $scope: $scope,
            colorResolve: mockColor
          });
        }));

        it('Should have the correct URL', function () {
          expect(viewstate.url).toEqual('/:colorId');
        });

        it('Should have a resolve function', function () {
          expect(typeof viewstate.resolve).toEqual('object');
          expect(typeof viewstate.resolve.colorResolve).toEqual('function');
        });

        it('should respond to URL', inject(function ($state) {
          expect($state.href(viewstate, {
            colorId: 1
          })).toEqual('/colors/1');
        }));

        it('should attach an color to the controller scope', function () {
          expect($scope.vm.color._id).toBe(mockColor._id);
        });

        it('Should not be abstract', function () {
          expect(viewstate.abstract).toBe(undefined);
        });

        it('Should have templateUrl', function () {
          expect(viewstate.templateUrl).toBe('/modules/colors/client/views/view-color.client.view.html');
        });
      });

      describe('Handle Trailing Slash', function () {
        beforeEach(inject(function ($state, $rootScope, $templateCache) {
          $templateCache.put('/modules/colors/client/views/list-colors.client.view.html', '');

          $state.go('colors.list');
          $rootScope.$digest();
        }));

        it('Should remove trailing slash', inject(function ($state, $location, $rootScope) {
          $location.path('colors/');
          $rootScope.$digest();

          expect($location.path()).toBe('/colors');
          expect($state.current.templateUrl).toBe('/modules/colors/client/views/list-colors.client.view.html');
        }));
      });
    });
  });
}());
