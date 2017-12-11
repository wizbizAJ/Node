(function () {
  'use strict';

  describe('Character_types Route Tests', function () {
    // Initialize global variables
    var $scope,
      Character_typesService;

    // We can start by loading the main application module
    beforeEach(module(ApplicationConfiguration.applicationModuleName));

    // The injector ignores leading and trailing underscores here (i.e. _$httpBackend_).
    // This allows us to inject a service but then attach it to a variable
    // with the same name as the service.
    beforeEach(inject(function ($rootScope, _Character_typesService_) {
      // Set a new global scope
      $scope = $rootScope.$new();
      Character_typesService = _Character_typesService_;
    }));

    describe('Route Config', function () {
      describe('Main Route', function () {
        var mainstate;
        beforeEach(inject(function ($state) {
          mainstate = $state.get('character_types');
        }));

        it('Should have the correct URL', function () {
          expect(mainstate.url).toEqual('/character_types');
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
          liststate = $state.get('character_types.list');
        }));

        it('Should have the correct URL', function () {
          expect(liststate.url).toEqual('');
        });

        it('Should not be abstract', function () {
          expect(liststate.abstract).toBe(undefined);
        });

        it('Should have templateUrl', function () {
          expect(liststate.templateUrl).toBe('/modules/character_types/client/views/list-character_types.client.view.html');
        });
      });

      describe('View Route', function () {
        var viewstate,
          Character_typesController,
          mockCharacter_type;

        beforeEach(inject(function ($controller, $state, $templateCache) {
          viewstate = $state.get('character_types.view');
          $templateCache.put('/modules/character_types/client/views/view-character_type.client.view.html', '');

          // create mock character_type
          mockCharacter_type = new Character_typesService({
            _id: '525a8422f6d0f87f0e407a33',
            title: 'An Character_type about MEAN',
            content: 'MEAN rocks!'
          });

          // Initialize Controller
          Character_typesController = $controller('Character_typesController as vm', {
            $scope: $scope,
            character_typeResolve: mockCharacter_type
          });
        }));

        it('Should have the correct URL', function () {
          expect(viewstate.url).toEqual('/:character_typeId');
        });

        it('Should have a resolve function', function () {
          expect(typeof viewstate.resolve).toEqual('object');
          expect(typeof viewstate.resolve.character_typeResolve).toEqual('function');
        });

        it('should respond to URL', inject(function ($state) {
          expect($state.href(viewstate, {
            character_typeId: 1
          })).toEqual('/character_types/1');
        }));

        it('should attach an character_type to the controller scope', function () {
          expect($scope.vm.character_type._id).toBe(mockCharacter_type._id);
        });

        it('Should not be abstract', function () {
          expect(viewstate.abstract).toBe(undefined);
        });

        it('Should have templateUrl', function () {
          expect(viewstate.templateUrl).toBe('/modules/character_types/client/views/view-character_type.client.view.html');
        });
      });

      describe('Handle Trailing Slash', function () {
        beforeEach(inject(function ($state, $rootScope, $templateCache) {
          $templateCache.put('/modules/character_types/client/views/list-character_types.client.view.html', '');

          $state.go('character_types.list');
          $rootScope.$digest();
        }));

        it('Should remove trailing slash', inject(function ($state, $location, $rootScope) {
          $location.path('character_types/');
          $rootScope.$digest();

          expect($location.path()).toBe('/character_types');
          expect($state.current.templateUrl).toBe('/modules/character_types/client/views/list-character_types.client.view.html');
        }));
      });
    });
  });
}());
