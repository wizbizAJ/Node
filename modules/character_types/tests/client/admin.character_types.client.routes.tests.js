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
          mainstate = $state.get('admin.character_types');
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
          liststate = $state.get('admin.character_types.list');
        }));

        it('Should have the correct URL', function () {
          expect(liststate.url).toEqual('');
        });

        it('Should be not abstract', function () {
          expect(liststate.abstract).toBe(undefined);
        });

        it('Should have templateUrl', function () {
          expect(liststate.templateUrl).toBe('/modules/character_types/client/views/admin/list-character_types.client.view.html');
        });
      });

      describe('Create Route', function () {
        var createstate,
          Character_typesAdminController,
          mockCharacter_type;

        beforeEach(inject(function ($controller, $state, $templateCache) {
          createstate = $state.get('admin.character_types.create');
          $templateCache.put('/modules/character_types/client/views/admin/form-character_type.client.view.html', '');

          // Create mock character_type
          mockCharacter_type = new Character_typesService();

          // Initialize Controller
          Character_typesAdminController = $controller('Character_typesAdminController as vm', {
            $scope: $scope,
            character_typeResolve: mockCharacter_type
          });
        }));

        it('Should have the correct URL', function () {
          expect(createstate.url).toEqual('/create');
        });

        it('Should have a resolve function', function () {
          expect(typeof createstate.resolve).toEqual('object');
          expect(typeof createstate.resolve.character_typeResolve).toEqual('function');
        });

        it('should respond to URL', inject(function ($state) {
          expect($state.href(createstate)).toEqual('/admin/character_types/create');
        }));

        it('should attach an character_type to the controller scope', function () {
          expect($scope.vm.character_type._id).toBe(mockCharacter_type._id);
          expect($scope.vm.character_type._id).toBe(undefined);
        });

        it('Should not be abstract', function () {
          expect(createstate.abstract).toBe(undefined);
        });

        it('Should have templateUrl', function () {
          expect(createstate.templateUrl).toBe('/modules/character_types/client/views/admin/form-character_type.client.view.html');
        });
      });

      describe('Edit Route', function () {
        var editstate,
          Character_typesAdminController,
          mockCharacter_type;

        beforeEach(inject(function ($controller, $state, $templateCache) {
          editstate = $state.get('admin.character_types.edit');
          $templateCache.put('/modules/character_types/client/views/admin/form-character_type.client.view.html', '');

          // Create mock character_type
          mockCharacter_type = new Character_typesService({
            _id: '525a8422f6d0f87f0e407a33',
            title: 'An Character_type about MEAN',
            content: 'MEAN rocks!'
          });

          // Initialize Controller
          Character_typesAdminController = $controller('Character_typesAdminController as vm', {
            $scope: $scope,
            character_typeResolve: mockCharacter_type
          });
        }));

        it('Should have the correct URL', function () {
          expect(editstate.url).toEqual('/:character_typeId/edit');
        });

        it('Should have a resolve function', function () {
          expect(typeof editstate.resolve).toEqual('object');
          expect(typeof editstate.resolve.character_typeResolve).toEqual('function');
        });

        it('should respond to URL', inject(function ($state) {
          expect($state.href(editstate, {
            character_typeId: 1
          })).toEqual('/admin/character_types/1/edit');
        }));

        it('should attach an character_type to the controller scope', function () {
          expect($scope.vm.character_type._id).toBe(mockCharacter_type._id);
        });

        it('Should not be abstract', function () {
          expect(editstate.abstract).toBe(undefined);
        });

        it('Should have templateUrl', function () {
          expect(editstate.templateUrl).toBe('/modules/character_types/client/views/admin/form-character_type.client.view.html');
        });

        xit('Should go to unauthorized route', function () {

        });
      });

    });
  });
}());
